const Portfolio = require('../models/Portfolio');
const { AppError } = require('../middleware/errorHandler');
const { uploadFile, deleteFile, getSignedUrl } = require('../services/gcpStorage');
const { logAction } = require('../utils/auditLogger');

async function resolveThumbnailUrl(url) {
  if (!url || !url.startsWith('gs://')) return url;
  try {
    return await getSignedUrl(url);
  } catch {
    return url;
  }
}

async function resolvePortfolioUrls(portfolio) {
  const obj = portfolio.toObject ? portfolio.toObject() : { ...portfolio };
  obj.thumbnail = await resolveThumbnailUrl(obj.thumbnail);
  return obj;
}

exports.getAll = async (req, res, next) => {
  try {
    const { active, featured, category } = req.query;
    const filter = {};
    if (active === 'true') filter.isActive = true;
    if (featured === 'true') filter.isFeatured = true;
    if (category) filter.category = category;

    const portfolios = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    const resolved = await Promise.all(portfolios.map(resolvePortfolioUrls));
    res.json({ success: true, data: resolved });
  } catch (error) {
    next(error);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) throw new AppError('Portfolio not found', 404);
    const resolved = await resolvePortfolioUrls(portfolio);
    res.json({ success: true, data: resolved });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.thumbnail = await uploadFile(req.file, 'portfolio-images');
    }
    if (typeof req.body.technologies === 'string') {
      req.body.technologies = JSON.parse(req.body.technologies);
    }
    if (typeof req.body.testimonial === 'string') {
      req.body.testimonial = JSON.parse(req.body.testimonial);
    }

    const portfolio = await Portfolio.create(req.body);

    await logAction({
      user: req.user._id,
      action: 'create',
      resource: 'portfolio',
      resourceId: portfolio._id,
      ip: req.ip,
    });

    const resolved = await resolvePortfolioUrls(portfolio);
    res.status(201).json({ success: true, data: resolved });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) throw new AppError('Portfolio not found', 404);

    if (req.file) {
      if (portfolio.thumbnail) await deleteFile(portfolio.thumbnail);
      req.body.thumbnail = await uploadFile(req.file, 'portfolio-images');
    }
    if (typeof req.body.technologies === 'string') {
      req.body.technologies = JSON.parse(req.body.technologies);
    }
    if (typeof req.body.testimonial === 'string') {
      req.body.testimonial = JSON.parse(req.body.testimonial);
    }

    Object.assign(portfolio, req.body);
    await portfolio.save();

    await logAction({
      user: req.user._id,
      action: 'update',
      resource: 'portfolio',
      resourceId: portfolio._id,
      ip: req.ip,
    });

    const resolved = await resolvePortfolioUrls(portfolio);
    res.json({ success: true, data: resolved });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) throw new AppError('Portfolio not found', 404);

    if (portfolio.thumbnail) await deleteFile(portfolio.thumbnail);
    for (const img of portfolio.images || []) {
      await deleteFile(img);
    }
    await portfolio.deleteOne();

    await logAction({
      user: req.user._id,
      action: 'delete',
      resource: 'portfolio',
      resourceId: portfolio._id,
      ip: req.ip,
    });

    res.json({ success: true, message: 'Portfolio deleted' });
  } catch (error) {
    next(error);
  }
};
