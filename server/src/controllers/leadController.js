const Lead = require('../models/Lead');
const { AppError } = require('../middleware/errorHandler');
const { sendContactEmail } = require('../services/emailService');
const { logAction } = require('../utils/auditLogger');

exports.getAll = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    sendContactEmail(lead).catch(() => {});
    res.status(201).json({ success: true, data: lead, message: 'Thank you! We\'ll be in touch.' });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);

    lead.status = status;
    if (notes) lead.notes = notes;
    await lead.save();

    await logAction({
      user: req.user._id,
      action: 'status_update',
      resource: 'lead',
      resourceId: lead._id,
      details: { status },
      ip: req.ip,
    });

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);

    await lead.deleteOne();

    await logAction({
      user: req.user._id,
      action: 'delete',
      resource: 'lead',
      resourceId: lead._id,
      ip: req.ip,
    });

    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};
