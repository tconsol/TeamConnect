const router = require('express').Router();
const { getUsers, createUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get all users
router.get('/', getUsers);

// Create new user
router.post('/', createUser);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;
