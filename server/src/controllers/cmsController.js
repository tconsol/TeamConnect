const CMS = require('../models/CMS');
const { logAction } = require('../utils/auditLogger');
const { uploadFile, deleteFile, getSignedUrl } = require('../services/gcpStorage');

const setNoStoreHeaders = (res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
};

// Helper to process base64 images and upload to GCP
const processTeamImages = async (teamArray) => {
  if (!Array.isArray(teamArray)) return teamArray;

  return Promise.all(
    teamArray.map(async (member) => {
      if (!member.image) return member;

      // Check if it's a base64 data URL
      if (member.image.startsWith('data:image')) {
        try {
          // Parse base64 data
          const matches = member.image.match(/^data:image\/(.*);base64,(.+)$/);
          if (!matches) return member;

          const [, ext, base64Data] = matches;
          const buffer = Buffer.from(base64Data, 'base64');

          // Create a file-like object for uploadFile
          const fileObj = {
            originalname: `${member.name || 'team'}.${ext}`,
            mimetype: `image/${ext}`,
            buffer,
          };

          // Upload to GCP
          const uploadedUrl = await uploadFile(fileObj, 'team-members');
          
          // Store the GCS path, not the signed URL (signed URLs expire in 60 min)
          console.log(`✓ Team member image uploaded: ${member.name}`);
          return { ...member, image: uploadedUrl };
        } catch (err) {
          console.error('Failed to upload team member image:', err);
          // Return member without image on error
          return { ...member, image: '' };
        }
      }

      // If it's already a URL, keep it as is
      return member;
    })
  );
};

// Helper to generate fresh signed URLs for team images at read time
const generateTeamImageSignedUrls = async (teamArray) => {
  if (!Array.isArray(teamArray)) return teamArray;

  return Promise.all(
    teamArray.map(async (member) => {
      if (!member.image) return member;

      // If the image is a GCS path (gs://), https URL, or signed URL, generate a fresh signed URL
      if (member.image.startsWith('gs://') || member.image.includes('storage.googleapis.com')) {
        try {
          const signedUrl = await getSignedUrl(member.image);
          console.log(`✓ Generated fresh signed URL for: ${member.name}`);
          return { ...member, image: signedUrl };
        } catch (err) {
          console.error(`✗ Failed to generate signed URL for ${member.name}:`, err.message);
          console.error(`  Original URL: ${member.image}`);
          // Return member without image on error
          return { ...member, image: '' };
        }
      }

      // If it's a different type of URL, return as is (shouldn't happen for team images)
      console.warn(`⚠ Unexpected image URL format for ${member.name}: ${member.image}`);
      return member;
    })
  );
};

exports.getContent = async (req, res, next) => {
  try {
    const { page } = req.params;
    const content = await CMS.findOne({ page });
    
    // Generate fresh signed URLs for team member images at read time
    if (content?.content?.team) {
      content.content.team = await generateTeamImageSignedUrls(content.content.team);
    }
    
    setNoStoreHeaders(res);
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

exports.getAllContent = async (_req, res, next) => {
  try {
    const content = await CMS.find();
    
    // Generate fresh signed URLs for team member images at read time
    const processedContent = await Promise.all(
      content.map(async (doc) => {
        if (doc.content?.team) {
          doc.content.team = await generateTeamImageSignedUrls(doc.content.team);
        }
        return doc;
      })
    );
    
    setNoStoreHeaders(res);
    res.json({ success: true, data: processedContent });
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const { page } = req.params;
    let updatedContent = req.body.content;

    // Process team member images for about page — handle deletions and replacements
    if (page === 'about' && updatedContent?.team) {
      // Get current team from DB to compare
      const existing = await CMS.findOne({ page });
      const oldTeam = existing?.content?.team || [];

      // Delete GCS files for removed or replaced members
      for (const oldMember of oldTeam) {
        if (!oldMember.image || !oldMember.image.startsWith('gs://')) continue;

        const stillExists = updatedContent.team.find(
          (m) => m.image === oldMember.image
        );
        if (!stillExists) {
          // Member removed or image replaced — delete old file from bucket
          await deleteFile(oldMember.image).catch((err) =>
            console.warn(`⚠ Could not delete old team image: ${err.message}`)
          );
        }
      }

      updatedContent.team = await processTeamImages(updatedContent.team);
    }

    const content = await CMS.findOneAndUpdate(
      { page },
      { content: updatedContent, updatedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    await logAction({
      user: req.user._id,
      action: 'update',
      resource: 'cms',
      resourceId: content._id,
      details: { page },
      ip: req.ip,
    });

    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};
