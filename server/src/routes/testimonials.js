const express = require('express');
const { getAll, getAllAdmin, getById, create, update, remove, toggleActive, reorder } = require('../controllers/testimonialController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getAll);
router.post('/', uploadImage.single('image'), create);

// Protected routes (admin only) - MUST come before :id route
router.get('/admin/all', authenticate, authorize('admin'), getAllAdmin);
router.patch('/admin/reorder', authenticate, authorize('admin'), reorder);

// Public route for specific testimonial
router.get('/:id', getById);

// Protected routes for admin actions
router.patch('/:id', authenticate, authorize('admin'), uploadImage.single('image'), update);
router.delete('/:id', authenticate, authorize('admin'), remove);
router.patch('/:id/toggle', authenticate, authorize('admin'), toggleActive);

module.exports = router;
