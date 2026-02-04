import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';
import RefreshToken from '../models/refreshToken.js';

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

/**
 * Generate a short-lived access token (15 minutes)
 */
function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

/**
 * Generate a cryptographically secure refresh token
 */
function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Set authentication cookies and store refresh token in DB
 */
async function setAuthCookies(res, user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  // Store refresh token in database
  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt,
  });

  // Set access token cookie (15 min)
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set refresh token cookie (7 days, only sent to /api/refresh)
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    path: '/api/refresh',
  });
}

/**
 * Signin handler - user has been authenticated by passport local strategy
 */
export const Signin = async (req, res) => {
  try {
    await setAuthCookies(res, req.user);
    res.json({
      message: 'Signed in successfully',
      user: { email: req.user.email },
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Validation rules for signup
 */
export const validateSignup = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

/**
 * Signup handler - create new user and set auth cookies
 */
export const Signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }

  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).send({ error: 'Email already registered' });
    }

    // Create and save new user
    const newUser = new User({ email, password });
    await newUser.save();

    // Set auth cookies
    await setAuthCookies(res, newUser);

    return res.json({
      message: 'Account created successfully',
      user: { email: newUser.email },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Refresh token handler - issue new access token using valid refresh token
 */
export const Refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    // Find and validate refresh token
    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    if (storedToken.isExpired()) {
      await storedToken.deleteOne();
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    // Get the user
    const user = await User.findById(storedToken.userId);
    if (!user) {
      await storedToken.deleteOne();
      return res.status(401).json({ error: 'User not found' });
    }

    // Issue new access token (keep same refresh token)
    const accessToken = generateAccessToken(user);

    res.cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      message: 'Token refreshed successfully',
      user: { email: user.email },
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
};

/**
 * Signout handler - clear cookies and revoke refresh token
 */
export const Signout = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    // Remove refresh token from database if it exists
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Clear both cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/refresh',
    });

    return res.json({ message: 'Signed out successfully' });
  } catch (err) {
    console.error('Signout error:', err);
    return res.status(500).json({ error: 'Failed to sign out' });
  }
};

/**
 * Signout everywhere - revoke all refresh tokens for user
 */
export const SignoutAll = async (req, res) => {
  try {
    await RefreshToken.revokeAllForUser(req.user.id);

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/refresh',
    });

    return res.json({ message: 'Signed out from all devices' });
  } catch (err) {
    console.error('Signout all error:', err);
    return res.status(500).json({ error: 'Failed to sign out from all devices' });
  }
};
