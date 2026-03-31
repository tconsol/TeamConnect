const router = require('express').Router();
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const { validate, schemas } = require('../middleware/validate');

router.get('/', serviceController.getAll);
router.get('/:slug', serviceController.getBySlug);
router.post('/', authenticate, uploadImage.single('image'), validate(schemas.createService), serviceController.create);
router.put('/:id', authenticate, uploadImage.single('image'), serviceController.update);
router.delete('/:id', authenticate, serviceController.remove);

module.exports = router;
