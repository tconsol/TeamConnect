const Application = require('../models/Application');
const Job = require('../models/Job');
const { AppError } = require('../middleware/errorHandler');
const { uploadFile } = require('../services/gcpStorage');
const { sendApplicationEmail, sendStatusUpdateEmail } = require('../services/emailService');
const { logAction } = require('../utils/auditLogger');

exports.getAll = async (req, res, next) => {
  try {
    const { status, job } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (job) filter.job = job;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('job', 'title department')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) throw new AppError('Application not found', 404);
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.apply = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || !job.isActive) throw new AppError('Job not found or inactive', 404);

    if (!req.file) throw new AppError('Resume is required', 400);

    const resumeUrl = await uploadFile(req.file, 'resumes');
    const application = await Application.create({
      ...req.body,
      job: job._id,
      resumeUrl,
    });

    job.applicationCount += 1;
    await job.save();

    sendApplicationEmail(application, job).catch(() => {});

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) throw new AppError('Application not found', 404);

    const oldStatus = application.status;
    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    sendStatusUpdateEmail(
      application.email,
      application.name,
      application.job.title,
      status
    ).catch(() => {});

    await logAction({
      user: req.user._id,
      action: 'status_update',
      resource: 'application',
      resourceId: application._id,
      details: { from: oldStatus, to: status },
      ip: req.ip,
    });

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
