import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';

function userToken(user) {
  const timestamp = new Date().getTime();
  return jwt.sign(
    { 
      sub: user.id, 
      iat: timestamp,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days expiration
    }, 
    process.env.JWT_SECRET
  );
}

export const Signin = (req, res) =>
  // User has had their email and password authorized, give them a token
  res.json({ token: userToken(req.user) });
export const validateSignup = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

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
    // See if a user with the given email exists
    const existingUser = await User.findOne({ email });

    // If email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email already registered' });
    }

    // If email does not exist, create and save user record
    const newUser = new User({
      email,
      password,
    });

    // save record to database
    await newUser.save();

    // respond to request indicating the user was created
    return res.json({ token: userToken(newUser) });
  } catch (err) {
    return next(err);
  }
};
