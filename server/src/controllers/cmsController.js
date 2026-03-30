const CMS = require('../models/CMS');
const { logAction } = require('../utils/auditLogger');

exports.getContent = async (req, res, next) => {
  try {
    const { page } = req.params;
    const content = await CMS.findOne({ page });
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

exports.getAllContent = async (_req, res, next) => {
  try {
    const content = await CMS.find();
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const { page } = req.params;
    const content = await CMS.findOneAndUpdate(
      { page },
      { content: req.body.content, updatedBy: req.user._id },
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
