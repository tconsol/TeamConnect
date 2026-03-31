const Service = require('../models/Service');
const { AppError } = require('../middleware/errorHandler');
const { uploadFile, deleteFile } = require('../services/gcpStorage');
const { logAction } = require('../utils/auditLogger');

exports.getAll = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = active === 'true' ? { isActive: true } : {};
    const services = await Service.find(filter).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new AppError('Service not found', 404);
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadFile(req.file, 'services');
    }
    if (typeof req.body.features === 'string') {
      req.body.features = JSON.parse(req.body.features);
    }
    if (typeof req.body.technologies === 'string') {
      req.body.technologies = JSON.parse(req.body.technologies);
    }

    const service = await Service.create(req.body);

    await logAction({
      user: req.user._id,
      action: 'create',
      resource: 'service',
      resourceId: service._id,
      ip: req.ip,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) throw new AppError('Service not found', 404);

    if (req.file) {
      if (service.image) await deleteFile(service.image);
      req.body.image = await uploadFile(req.file, 'services');
    }
    if (typeof req.body.features === 'string') {
      req.body.features = JSON.parse(req.body.features);
    }
    if (typeof req.body.technologies === 'string') {
      req.body.technologies = JSON.parse(req.body.technologies);
    }

    Object.assign(service, req.body);
    await service.save();

    await logAction({
      user: req.user._id,
      action: 'update',
      resource: 'service',
      resourceId: service._id,
      ip: req.ip,
    });

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) throw new AppError('Service not found', 404);

    if (service.image) await deleteFile(service.image);
    await service.deleteOne();

    await logAction({
      user: req.user._id,
      action: 'delete',
      resource: 'service',
      resourceId: service._id,
      ip: req.ip,
    });

    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};
