const router = require('express').Router();
const jobController = require('../controllers/jobController');
const { authenticate } = require('../middleware/auth');

router.get('/', jobController.getAll);
router.get('/:id', jobController.getById);
router.post('/', authenticate, jobController.create);
router.put('/:id', authenticate, jobController.update);
router.delete('/:id', authenticate, jobController.remove);

module.exports = router;
