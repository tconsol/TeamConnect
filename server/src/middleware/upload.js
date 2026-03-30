const multer = require('multer');
const path = require('path');
const { AppError } = require('./errorHandler');

const storage = multer.memoryStorage();

const fileFilter = (allowedTypes) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeAllowed = allowedTypes.includes(file.mimetype);
  const extAllowed = allowedTypes.some((t) => {
    const map = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    };
    return map[t]?.includes(ext);
  });

  if (mimeAllowed && extAllowed) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type', 400), false);
  }
};

const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const resumeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const uploadImage = multer({
  storage,
  fileFilter: fileFilter(imageTypes),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadResume = multer({
  storage,
  fileFilter: fileFilter(resumeTypes),
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { uploadImage, uploadResume };
