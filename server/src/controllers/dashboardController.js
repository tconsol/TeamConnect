const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Job = require('../models/Job');
const User = require('../models/User');
const Lead = require('../models/Lead');
const AuditLog = require('../models/AuditLog');

exports.getStats = async (_req, res, next) => {
  try {
    const [services, portfolios, activeJobs, users, leads, recentLogs] =
      await Promise.all([
        Service.countDocuments(),
        Portfolio.countDocuments(),
        Job.countDocuments({ isActive: true }),
        User.countDocuments(),
        Lead.countDocuments(),
        AuditLog.find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(20),
      ]);

    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        counts: { services, portfolios, activeJobs, users, leads },
        leadsByStatus,
        recentActivity: recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};
