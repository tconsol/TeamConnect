const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const config = require('../config');
const logger = require('../config/logger');

let storage;
try {
  storage = new Storage({
    projectId: config.gcp.projectId,
    keyFilename: config.gcp.keyFile,
  });
} catch {
  logger.warn('GCP Storage not configured — file uploads will fail');
}

const bucket = storage ? storage.bucket(config.gcp.bucketName) : null;

const uploadFile = async (file, folder) => {
  if (!bucket) throw new Error('GCP Storage not configured');

  const ext = path.extname(file.originalname);
  const filename = `${folder}/${uuidv4()}${ext}`;
  const blob = bucket.file(filename);

  await blob.save(file.buffer, {
    metadata: { contentType: file.mimetype },
    resumable: false,
  });

  await blob.makePublic();
  return `https://storage.googleapis.com/${config.gcp.bucketName}/${filename}`;
};

const getSignedUrl = async (filename) => {
  if (!bucket) throw new Error('GCP Storage not configured');

  const [url] = await bucket.file(filename).getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000,
  });
  return url;
};

const deleteFile = async (fileUrl) => {
  if (!bucket || !fileUrl) return;

  try {
    const filename = fileUrl.replace(
      `https://storage.googleapis.com/${config.gcp.bucketName}/`,
      ''
    );
    await bucket.file(filename).delete();
  } catch (err) {
    logger.error('Failed to delete file from GCP:', err.message);
  }
};

module.exports = { uploadFile, getSignedUrl, deleteFile };
