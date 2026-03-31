const CMS = require('../models/CMS');
const { logAction } = require('../utils/auditLogger');

const setNoStoreHeaders = (res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
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
