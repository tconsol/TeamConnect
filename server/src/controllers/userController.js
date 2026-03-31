const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Create new user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user — password hashing handled by pre-save hook in User model
    const user = new User({
      name,
      email,
      password,
      role: role || 'admin',
      createdBy: req.user?._id,
    });

    await user.save();

    // Log action
    await AuditLog.create({
      action: 'CREATE_USER',
      user: req.user?._id,
      details: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = password; // pre-save hook handles hashing

    await user.save();

    await AuditLog.create({
      action: 'UPDATE_USER',
      user: req.user?._id,
      details: { userId: user._id, email: user.email, role: user.role },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Don't allow deletion of self
    if (user._id.toString() === req.user?._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Log action before deletion
    await AuditLog.create({
      action: 'DELETE_USER',
      user: req.user?._id,
      details: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
