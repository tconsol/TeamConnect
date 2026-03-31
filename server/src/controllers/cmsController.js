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
          
          // Get authenticated (signed) URL for the uploaded file
          const authenticatedUrl = await getSignedUrl(uploadedUrl);
          
          console.log(`✓ Team member image uploaded: ${member.name}`);
          return { ...member, image: authenticatedUrl };
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

exports.getContent = async (req, res, next) => {
  try {
    const { page } = req.params;
    const content = await CMS.findOne({ page });
    setNoStoreHeaders(res);
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

exports.getAllContent = async (_req, res, next) => {
  try {
    const content = await CMS.find();
    setNoStoreHeaders(res);
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const { page } = req.params;
    let updatedContent = req.body.content;

    // Process team member images for about page
    if (page === 'about' && updatedContent?.team) {
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
