const Skill = require('../models/Skill');
const { AppError } = require('../middleware/errorHandler');
const { uploadFile, deleteFile } = require('../services/gcpStorage');
const { logAction } = require('../utils/auditLogger');

const normalizePayload = (payload) => {
  if (payload.proficiency !== undefined) {
    payload.proficiency = Number(payload.proficiency);
  }

  if (payload.order !== undefined) {
    payload.order = Number(payload.order);
  }

  if (payload.isActive !== undefined) {
    payload.isActive = String(payload.isActive) === 'true';
  }

  return payload;
};

exports.getAll = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = active === 'true' ? { isActive: true } : {};

    const skills = await Skill.find(filter).sort({ order: 1, createdAt: 1 });
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    let uploadedImagePath;
    
    if (req.file) {
      uploadedImagePath = await uploadFile(req.file, 'skills');
      req.body.image = uploadedImagePath;
    }

    normalizePayload(req.body);
    
    try {
      const skill = await Skill.create(req.body);

      await logAction({
        user: req.user._id,
        action: 'create',
        resource: 'skill',
        resourceId: skill._id,
        ip: req.ip,
      });

      res.status(201).json({ success: true, data: skill });
    } catch (error) {
      // If skill creation failed and we uploaded an image, delete it
      if (uploadedImagePath) {
        await deleteFile(uploadedImagePath).catch(() => {});
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw new AppError('Skill not found', 404);

    let newImagePath;
    
    if (req.file) {
      try {
        // Upload new file first
        newImagePath = await uploadFile(req.file, 'skills');
        req.body.image = newImagePath;
      } catch (uploadError) {
        // If upload fails, don't modify skill
        throw uploadError;
      }
    }

    normalizePayload(req.body);
    const oldImagePath = skill.image;
    Object.assign(skill, req.body);
    await skill.save();

    // Only delete old file after successful save
    if (newImagePath && oldImagePath) {
      await deleteFile(oldImagePath).catch(() => {});
    }

    await logAction({
      user: req.user._id,
      action: 'update',
      resource: 'skill',
      resourceId: skill._id,
      ip: req.ip,
    });

    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw new AppError('Skill not found', 404);

    if (skill.image) await deleteFile(skill.image);
    await skill.deleteOne();

    await logAction({
      user: req.user._id,
      action: 'delete',
      resource: 'skill',
      resourceId: skill._id,
      ip: req.ip,
    });

    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
};
