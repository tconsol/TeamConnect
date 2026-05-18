const AuditLog = require('../models/AuditLog');

const logAction = async ({ user, action, resource, resourceId, details, ip }) => {
  try {
    await AuditLog.create({ user, action, resource, resourceId, details, ip });
  } catch {
    // Non-critical don't break the request
  }
};

module.exports = { logAction };
