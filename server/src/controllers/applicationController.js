const Application = require('../models/Application');
const Job = require('../models/Job');
const { AppError } = require('../middleware/errorHandler');
const { uploadFile, getSignedUrl } = require('../services/gcpStorage');
const { sendApplicationEmail, sendStatusUpdateEmail } = require('../services/emailService');
const { logAction } = require('../utils/auditLogger');

async function resolveResumeUrl(url) {
  if (!url || !url.startsWith('gs://')) return url;
  try {
    return await getSignedUrl(url);
  } catch {
    return url;
  }
}

async function resolveApplicationUrls(app) {
  const obj = app.toObject ? app.toObject() : { ...app };
  obj.resumeUrl = await resolveResumeUrl(obj.resumeUrl);
  return obj;
}

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

    const resolved = await Promise.all(applications.map(resolveApplicationUrls));

    res.json({
      success: true,
      data: resolved,
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
    const resolved = await resolveApplicationUrls(application);
    res.json({ success: true, data: resolved });
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

    await Job.updateOne({ _id: job._id }, { $inc: { applicationCount: 1 } });

    sendApplicationEmail(application, job).catch(() => {});

    const resolved = await resolveApplicationUrls(application);
    res.status(201).json({ success: true, data: resolved });
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

exports.delete = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) throw new AppError('Application not found', 404);

    await Application.findByIdAndDelete(req.params.id);

    await logAction({
      user: req.user._id,
      action: 'delete',
      resource: 'application',
      resourceId: application._id,
      details: { email: application.email, job: application.job },
      ip: req.ip,
    });

    res.json({ success: true, message: 'Application deleted successfully', data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
};
