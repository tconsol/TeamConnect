const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { AppError } = require('../middleware/errorHandler');
const { logAction } = require('../utils/auditLogger');

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiry });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiry });

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

    user.refreshTokens.push(refreshToken);
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
      data: { user, accessToken, refreshToken },
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

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Invalid refresh token', 401);
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push(newRefreshToken);
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
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
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
