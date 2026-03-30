const router = require('express').Router();
const cmsController = require('../controllers/cmsController');
const { authenticate } = require('../middleware/auth');

router.get('/', cmsController.getAllContent);
router.get('/:page', cmsController.getContent);
router.put('/:page', authenticate, cmsController.updateContent);

module.exports = router;
