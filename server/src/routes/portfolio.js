const router = require('express').Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticate } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', portfolioController.getAll);
router.get('/:slug', portfolioController.getBySlug);
router.post('/', authenticate, uploadImage.single('thumbnail'), portfolioController.create);
router.put('/:id', authenticate, uploadImage.single('thumbnail'), portfolioController.update);
router.delete('/:id', authenticate, portfolioController.remove);

module.exports = router;
