const router = require('express').Router();
const applicationController = require('../controllers/applicationController');
const { authenticate } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');
const { validate, schemas } = require('../middleware/validate');

router.get('/', authenticate, applicationController.getAll);
router.get('/:id', authenticate, applicationController.getById);
router.post(
  '/:jobId/apply',
  uploadResume.single('resume'),
  validate(schemas.createApplication),
  applicationController.apply
);
router.patch('/:id/status', authenticate, applicationController.updateStatus);

module.exports = router;
