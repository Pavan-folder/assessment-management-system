import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { authenticateToken, authRateLimit } from '../middleware/auth';
import { AuthRequest, AuthResponse, RegisterRequest } from '../types';
import { catchAsync } from '../middleware/errorHandler';
import { users } from '../utils/userInitializer';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit(authRateLimit);

// Register new user
router.post('/register', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 })
], catchAsync(async (req: RegisterRequest, res: express.Response) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password, firstName, lastName } = req.body;

  // Validate user data
  const validation = User.validate({ email, password, firstName, lastName });
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validation.errors
    });
  }

  // Check if user already exists
  // In a real app, you'd check against a database
  // For now, we'll simulate this

  // Create new user
  const user = new User(email, password, firstName, lastName);
  await user.hashPassword();

  // Store user in memory for demo purposes
  users.set(email.toLowerCase(), user);

  // Generate JWT token
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    secret,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    },
    token
  });
}));

// Login user
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], catchAsync(async (req: AuthRequest, res: express.Response) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user from our in-memory storage
  const user = users.get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Verify password
  const isValidPassword = await user.verifyPassword(password);
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate JWT token
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    secret,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    },
    token
  });
}));

// Get current user profile
router.get('/profile', authenticateToken, (req: express.Request, res: express.Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  res.json({
    success: true,
    user: req.user.toSafeJSON()
  });
});

// Refresh token
router.post('/refresh', authenticateToken, (req: express.Request, res: express.Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  const token = jwt.sign(
    { userId: req.user.id, email: req.user.email },
    secret,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    token
  });
});

// Logout (client-side token removal)
router.post('/logout', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export { router as authRoutes };
