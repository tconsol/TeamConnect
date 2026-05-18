const Testimonial = require('../models/Testimonial');
const { AppError } = require('../middleware/errorHandler');
const { logAction } = require('../utils/auditLogger');
const { uploadFile, deleteFile } = require('../services/gcpStorage');

exports.getAll = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

exports.getAllAdmin = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) throw new AppError('Testimonial not found', 404);
    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    let uploadedImagePath;

    if (req.file) {
      uploadedImagePath = await uploadFile(req.file, 'testimonials');
      req.body.image = uploadedImagePath;
    }

    req.body.avatar = req.body.avatar || req.body.author?.charAt(0).toUpperCase() || '?';
    // Auto-generate color never take from client input
    delete req.body.color;
    // Set isActive: true for admin submissions, false for client submissions (needs approval)
    req.body.isActive = req.user && req.user.role === 'admin' ? true : false;

    try {
      const testimonial = await Testimonial.create(req.body);

      // Only log action if user is authenticated (admin submission)
      if (req.user) {
        await logAction({
          user: req.user._id,
          action: 'create',
          resource: 'testimonial',
          resourceId: testimonial._id,
          ip: req.ip,
        });
      }

      res.status(201).json({ success: true, data: testimonial, message: 'Testimonial created successfully' });
    } catch (error) {
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
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) throw new AppError('Testimonial not found', 404);

    let newImagePath;

    if (req.file) {
      try {
        newImagePath = await uploadFile(req.file, 'testimonials');
        req.body.image = newImagePath;
      } catch (uploadError) {
        throw uploadError;
      }
    }

    req.body.avatar = req.body.avatar || req.body.author?.charAt(0).toUpperCase() || testimonial.avatar;
    // Never allow color to be changed via update
    delete req.body.color;

    const oldImagePath = testimonial.image;
    Object.assign(testimonial, req.body);
    await testimonial.save();

    if (newImagePath && oldImagePath) {
      await deleteFile(oldImagePath).catch(() => {});
    }

    await logAction({
      user: req.user._id,
      action: 'update',
      resource: 'testimonial',
      resourceId: testimonial._id,
      ip: req.ip,
    });

    res.json({ success: true, data: testimonial, message: 'Testimonial updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) throw new AppError('Testimonial not found', 404);

    if (testimonial.image) {
      await deleteFile(testimonial.image).catch(() => {});
    }

    await testimonial.deleteOne();

    await logAction({
      user: req.user._id,
      action: 'delete',
      resource: 'testimonial',
      resourceId: testimonial._id,
      ip: req.ip,
    });

    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.toggleActive = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    if (!testimonial) throw new AppError('Testimonial not found', 404);

    await logAction({
      user: req.user._id,
      action: 'update',
      resource: 'testimonial',
      resourceId: testimonial._id,
      details: { isActive },
      ip: req.ip,
    });

    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

exports.reorder = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, order }, ...]

    if (!Array.isArray(items)) throw new AppError('Items must be an array', 400);

    await Promise.all(
      items.map((item) =>
        Testimonial.findByIdAndUpdate(item.id, { order: item.order })
      )
    );

    await logAction({
      user: req.user._id,
      action: 'update',
      resource: 'testimonial',
      details: { action: 'reorder', count: items.length },
      ip: req.ip,
    });

    const updated = await Testimonial.find().sort({ order: 1 });
    res.json({ success: true, data: updated, message: 'Order updated successfully' });
  } catch (error) {
    next(error);
  }
};
