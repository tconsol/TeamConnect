const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.post('/login', validate(schemas.login), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, authController.changePassword);
router.get('/me', authenticate, authController.me);

module.exports = router;
