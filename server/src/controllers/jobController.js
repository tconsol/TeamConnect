const Job = require('../models/Job');
const { AppError } = require('../middleware/errorHandler');
const { logAction } = require('../utils/auditLogger');

exports.getAll = async (req, res, next) => {
  try {
    const { active, department, type } = req.query;
    const filter = {};
    if (active === 'true') filter.isActive = true;
    if (department) filter.department = department;
    if (type) filter.type = type;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw new AppError('Job not found', 404);
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const parseJsonField = (value, fieldName) => {
      if (typeof value !== 'string') return value;
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new AppError(`Invalid JSON for field: ${fieldName}`, 400);
      }
    };

    if (typeof req.body.requirements === 'string') {
      req.body.requirements = parseJsonField(req.body.requirements, 'requirements');
    }
    if (typeof req.body.responsibilities === 'string') {
      req.body.responsibilities = parseJsonField(req.body.responsibilities, 'responsibilities');
    }
    if (typeof req.body.benefits === 'string') {
      req.body.benefits = parseJsonField(req.body.benefits, 'benefits');
    }
    if (typeof req.body.salaryRange === 'string') {
      req.body.salaryRange = parseJsonField(req.body.salaryRange, 'salaryRange');
    }
    if (req.body.salaryRange) {
      req.body.salaryRange.currency = 'INR';
      req.body.salaryRange.period = 'annum';
    }
    if (typeof req.body.techStack === 'string') {
      req.body.techStack = parseJsonField(req.body.techStack, 'techStack');
    }

    const job = await Job.create(req.body);

    await logAction({
      user: req.user._id,
      action: 'create',
      resource: 'job',
      resourceId: job._id,
      ip: req.ip,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw new AppError('Job not found', 404);

    if (typeof req.body.requirements === 'string') {
      req.body.requirements = JSON.parse(req.body.requirements);
    }
    if (typeof req.body.responsibilities === 'string') {
      req.body.responsibilities = JSON.parse(req.body.responsibilities);
    }
    if (typeof req.body.benefits === 'string') {
      req.body.benefits = JSON.parse(req.body.benefits);
    }
    if (typeof req.body.salaryRange === 'string') {
      req.body.salaryRange = JSON.parse(req.body.salaryRange);
    }
    if (req.body.salaryRange) {
      req.body.salaryRange.currency = 'INR';
      req.body.salaryRange.period = 'annum';
    }
    if (typeof req.body.techStack === 'string') {
      req.body.techStack = JSON.parse(req.body.techStack);
    }

    Object.assign(job, req.body);
    await job.save();

    await logAction({
      user: req.user._id,
      action: 'update',
      resource: 'job',
      resourceId: job._id,
      ip: req.ip,
    });

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw new AppError('Job not found', 404);

    await job.deleteOne();

    await logAction({
      user: req.user._id,
      action: 'delete',
      resource: 'job',
      resourceId: job._id,
      ip: req.ip,
    });

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};
