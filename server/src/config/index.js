require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  gcp: {
    projectId: process.env.GCP_PROJECT_ID,
    bucketName: process.env.GCP_BUCKET_NAME,
    privateKeyId: process.env.GCP_PRIVATE_KEY_ID,
    privateKey: process.env.GCP_PRIVATE_KEY
      ?.replace(/\\n/g, '\n')
      ?.replace(/^["']|["']$/g, ''),
    clientEmail: process.env.GCP_CLIENT_EMAIL,
    clientId: process.env.GCP_CLIENT_ID,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.FROM_EMAIL || 'noreply@tconsolutions.com',
  },
  redisUrl: process.env.REDIS_URL,
};

// Validate required config at startup
const required = [
  ['mongoUri', config.mongoUri],
  ['jwt.accessSecret', config.jwt.accessSecret],
  ['jwt.refreshSecret', config.jwt.refreshSecret],
];
const missing = required.filter(([, val]) => !val).map(([key]) => key);
if (missing.length > 0) {
  console.error(`❌ Missing required config: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = config;
