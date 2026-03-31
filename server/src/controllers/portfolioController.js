const Portfolio = require('../models/Portfolio');
const { AppError } = require('../middleware/errorHandler');
const { uploadFile, deleteFile, getSignedUrl } = require('../services/gcpStorage');
const { logAction } = require('../utils/auditLogger');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Parse a FormData field that was JSON.stringify-ed before sending */
function parseJsonField(value) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return JSON.parse(value);
  return value;
}

async function resolveThumbnailUrl(url) {
  if (!url || !url.startsWith('gs://')) return url;
  try { return await getSignedUrl(url); } catch { return url; }
}

async function resolvePortfolioUrls(portfolio) {
  const obj = portfolio.toObject ? portfolio.toObject() : { ...portfolio };
  obj.thumbnail = await resolveThumbnailUrl(obj.thumbnail);
  return obj;
}

// ── Controllers ───────────────────────────────────────────────────────────────

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
    const data = {
      title:            req.body.title,
      shortDescription: req.body.shortDescription,
      category:         req.body.category,
      client:           req.body.client,
      description:      req.body.description,
      liveUrl:          req.body.liveUrl,
      isFeatured:       req.body.isFeatured === 'true',
      isActive:         req.body.isActive !== 'false',
      order:            Number(req.body.order) || 0,
      // Array fields — all sent as JSON strings from admin
      technologies:     parseJsonField(req.body.technologies) || [],
      challenges:       parseJsonField(req.body.challenges) || [],
      solution:         parseJsonField(req.body.solution) || [],
      results:          parseJsonField(req.body.results) || [],
    };

    if (req.body.testimonial) {
      data.testimonial = parseJsonField(req.body.testimonial);
    }

    if (req.file) {
      data.thumbnail = await uploadFile(req.file, 'portfolio-images');
    }

    const portfolio = await Portfolio.create(data);

    await logAction({ user: req.user._id, action: 'create', resource: 'portfolio', resourceId: portfolio._id, ip: req.ip });

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

    // Scalar fields
    if (req.body.title !== undefined)            portfolio.title            = req.body.title;
    if (req.body.shortDescription !== undefined) portfolio.shortDescription = req.body.shortDescription;
    if (req.body.category !== undefined)         portfolio.category         = req.body.category;
    if (req.body.client !== undefined)           portfolio.client           = req.body.client;
    if (req.body.description !== undefined)      portfolio.description      = req.body.description;
    if (req.body.liveUrl !== undefined)          portfolio.liveUrl          = req.body.liveUrl;
    if (req.body.isFeatured !== undefined)       portfolio.isFeatured       = req.body.isFeatured === 'true';
    if (req.body.isActive !== undefined)         portfolio.isActive         = req.body.isActive !== 'false';
    if (req.body.order !== undefined)            portfolio.order            = Number(req.body.order) || 0;
    if (req.body.testimonial !== undefined)      portfolio.testimonial      = parseJsonField(req.body.testimonial);

    // Array fields — use .set() so Mongoose correctly tracks the change
    if (req.body.technologies !== undefined) portfolio.set('technologies', parseJsonField(req.body.technologies) || []);
    if (req.body.challenges    !== undefined) portfolio.set('challenges',   parseJsonField(req.body.challenges)   || []);
    if (req.body.solution      !== undefined) portfolio.set('solution',     parseJsonField(req.body.solution)     || []);
    if (req.body.results       !== undefined) portfolio.set('results',      parseJsonField(req.body.results)      || []);

    // Thumbnail — delete old file from GCS when replaced
    if (req.file) {
      if (portfolio.thumbnail) await deleteFile(portfolio.thumbnail);
      portfolio.thumbnail = await uploadFile(req.file, 'portfolio-images');
    }

    await portfolio.save();

    await logAction({ user: req.user._id, action: 'update', resource: 'portfolio', resourceId: portfolio._id, ip: req.ip });

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

    // Delete all associated GCS files
    if (portfolio.thumbnail) await deleteFile(portfolio.thumbnail);
    for (const img of portfolio.images || []) await deleteFile(img);

    await portfolio.deleteOne();

    await logAction({ user: req.user._id, action: 'delete', resource: 'portfolio', resourceId: portfolio._id, ip: req.ip });

    res.json({ success: true, message: 'Portfolio deleted' });
  } catch (error) {
    next(error);
  }
};

