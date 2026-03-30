const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Lead = require('../models/Lead');
const AuditLog = require('../models/AuditLog');

exports.getStats = async (_req, res, next) => {
  try {
    const [services, portfolios, activeJobs, applications, leads, recentLogs] =
      await Promise.all([
        Service.countDocuments(),
        Portfolio.countDocuments(),
        Job.countDocuments({ isActive: true }),
        Application.countDocuments(),
        Lead.countDocuments(),
        AuditLog.find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(20),
      ]);

    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const appsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        counts: { services, portfolios, activeJobs, applications, leads },
        leadsByStatus,
        appsByStatus,
        recentActivity: recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};
