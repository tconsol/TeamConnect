const winston = require('winston');
const path = require('path');

const levelIcons = { error: '✗', warn: '⚠', info: '●', debug: '…' };
const levelColors = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m', debug: '\x1b[90m' };
const reset = '\x1b[0m';

const consoleFormat = winston.format.printf(({ level, message, timestamp, method, statusCode, path: reqPath }) => {
  const time = timestamp ? timestamp.split(' ')[1] || timestamp : '';
  const icon = levelIcons[level] || '●';
  const color = levelColors[level] || '';

  // If it's an HTTP request log (has method & statusCode)
  if (method && statusCode) {
    const code = Number(statusCode);
    const codeColor = code >= 500 ? '\x1b[31m' : code >= 400 ? '\x1b[33m' : code >= 300 ? '\x1b[90m' : '\x1b[32m';
    return `\x1b[90m${time}${reset}  ${codeColor}${method} ${reqPath} ${statusCode}${reset}  ${message || ''}`;
  }

  return `\x1b[90m${time}${reset}  ${color}${icon} ${message}${reset}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'tcon-api' },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        consoleFormat
      ),
    })
  );
}

module.exports = logger;
