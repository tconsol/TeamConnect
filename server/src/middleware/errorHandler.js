const logger = require('../config/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue && typeof err.keyValue === 'object'
      ? Object.keys(err.keyValue)[0] || 'unknown'
      : 'unknown';
    message = `Duplicate value for ${field}`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  logger.error({
    message: err.message,
    statusCode,
    method: req.method,
    path: req.path,
  });

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && !err.isOperational
      ? 'Internal Server Error'
      : message,
  });
};

module.exports = { AppError, errorHandler };
