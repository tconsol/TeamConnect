const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { Readable } = require('stream');
const config = require('../config');
const logger = require('../config/logger');

let storage;
let gcpError = null;
try {
  if (!config.gcp.privateKey || !config.gcp.clientEmail) {
    throw new Error('GCP credentials not set — check GCP_PRIVATE_KEY and GCP_CLIENT_EMAIL in .env');
  }
  // Validate key format
  const key = config.gcp.privateKey;
  if (!key.includes('-----BEGIN') || !key.includes('-----END')) {
    throw new Error('GCP_PRIVATE_KEY is malformed — must be a valid PEM private key');
  }
  storage = new Storage({
    projectId: config.gcp.projectId,
    credentials: {
      type: 'service_account',
      project_id: config.gcp.projectId,
      private_key_id: config.gcp.privateKeyId,
      private_key: key,
      client_email: config.gcp.clientEmail,
      client_id: config.gcp.clientId,
    },
  });
} catch (err) {
  gcpError = err.message;
  logger.warn(`GCP Storage not configured — file uploads will fail: ${err.message}`);
}

const bucket = storage ? storage.bucket(config.gcp.bucketName) : null;

// Only resumes and team-members need signed URLs (private content).
// portfolio-images are public content — they get permanent storage.googleapis.com URLs.
const SENSITIVE_FOLDERS = ['resumes', 'team-members'];

const uploadFile = async (file, folder) => {
  if (!bucket) throw new Error(`GCP Storage not configured: ${gcpError || 'unknown error'}`);

  const ext = path.extname(file.originalname);
  const filename = `${folder}/${uuidv4()}${ext}`;
  const blob = bucket.file(filename);

  try {
    await new Promise((resolve, reject) => {
      const writeStream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
        resumable: false,
      });
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);
      Readable.from(file.buffer).pipe(writeStream);
    });
  } catch (err) {
    if (err.message?.includes('DECODER') || err.message?.includes('unsupported')) {
      throw new Error('GCP authentication failed — check GCP_PRIVATE_KEY in .env (key may be invalid or rotated)');
    }
    throw err;
  }

  if (SENSITIVE_FOLDERS.includes(folder)) {
    // Return the GCS path — callers must use getSignedUrl for access
    return `gs://${config.gcp.bucketName}/${filename}`;
  }

  // Uniform bucket-level access is enabled — objects inherit bucket IAM; no per-object ACL needed
  return `https://storage.googleapis.com/${config.gcp.bucketName}/${filename}`;
};

const extractFilename = (fileUrl) => {
  // Remove query parameters (from signed URLs)
  const urlWithoutQuery = fileUrl.split('?')[0];
  
  if (urlWithoutQuery.startsWith('gs://')) {
    return urlWithoutQuery.replace(`gs://${config.gcp.bucketName}/`, '');
  }
  return urlWithoutQuery.replace(
    `https://storage.googleapis.com/${config.gcp.bucketName}/`,
    ''
  );
};

const getSignedUrl = async (fileUrl) => {
  if (!bucket) throw new Error('GCP Storage not configured');

  const filename = extractFilename(fileUrl);
  const [url] = await bucket.file(filename).getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000,
  });
  return url;
};

const deleteFile = async (fileUrl) => {
  if (!bucket || !fileUrl) return;

  try {
    const filename = extractFilename(fileUrl);
    await bucket.file(filename).delete();
  } catch (err) {
    logger.error('Failed to delete file from GCP:', err.message);
  }
};

module.exports = { uploadFile, getSignedUrl, deleteFile };
