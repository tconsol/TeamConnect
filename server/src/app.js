const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const config = require('./config');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.nodeEnv !== 'test') {
  morgan.token('response-time-ms', (req, res) => {
    const diff = process.hrtime(req._startAt);
    return diff ? `${(diff[0] * 1e3 + diff[1] * 1e-6).toFixed(0)}ms` : '-';
  });
  app.use(morgan(':method :url :status :response-time-ms', {
    stream: {
      write: (msg) => {
        const parts = msg.trim().split(' ');
        const [method, url, status, time] = parts;
        logger.info({
          message: `${time || ''}`,
          method,
          statusCode: status,
          path: url,
        });
      },
    },
  }));
}

// API routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Database + Start
const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected');

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
