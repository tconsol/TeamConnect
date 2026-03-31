const router = require('express').Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all users
router.get('/', getUsers);

// Create new user
router.post('/', createUser);

// Update user
router.patch('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;
