const router = require('express').Router();
const skillController = require('../controllers/skillController');
const { authenticate } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', skillController.getAll);
router.post('/', authenticate, uploadImage.single('image'), skillController.create);
router.put('/:id', authenticate, uploadImage.single('image'), skillController.update);
router.delete('/:id', authenticate, skillController.remove);

module.exports = router;
