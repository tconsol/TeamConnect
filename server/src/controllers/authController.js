const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const config = require('../config');
const { AppError } = require('../middleware/errorHandler');
const { logAction } = require('../utils/auditLogger');

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiry });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiry });

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account deactivated', 403);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ tokenHash: hashToken(refreshToken), createdAt: new Date() });
    if (user.refreshTokens.length > 5) user.refreshTokens.shift();
    await user.save();

    await logAction({
      user: user._id,
      action: 'login',
      resource: 'auth',
      ip: req.ip,
    });

    res.json({
      success: true,
      data: { user: user.toJSON(), accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await User.findById(decoded.userId);

    const tokenHash = hashToken(refreshToken);
    if (!user || !user.refreshTokens.some((t) => t.tokenHash === tokenHash)) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Remove old refresh token atomically
    user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== tokenHash);
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    
    // Add new refresh token
    user.refreshTokens.push({ tokenHash: hashToken(newRefreshToken), createdAt: new Date() });
    
    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user._id);
    if (user) {
      const tokenHash = hashToken(refreshToken);
      user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== tokenHash);
      await user.save();
    }

    await logAction({
      user: req.user._id,
      action: 'logout',
      resource: 'auth',
      ip: req.ip,
    });

    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, data: req.user });
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) throw new AppError('User not found', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ tokenHash: hashToken(refreshToken), createdAt: new Date() });
    await user.save();

    await logAction({
      user: user._id,
      action: 'change_password',
      resource: 'auth',
      ip: req.ip,
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};
