const router = require('express').Router();
const leadController = require('../controllers/leadController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.post('/', validate(schemas.createLead), leadController.create);
router.get('/', authenticate, leadController.getAll);
router.get('/:id', authenticate, leadController.getById);
router.patch('/:id/status', authenticate, leadController.updateStatus);
router.delete('/:id', authenticate, leadController.remove);

module.exports = router;
