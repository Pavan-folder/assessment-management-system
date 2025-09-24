import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// JWT Authentication middleware
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured');
      res.status(500).json({
        error: 'Server configuration error',
        message: 'Authentication service unavailable'
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Import users map from auth routes (we'll need to make it accessible)
      // For now, we'll create a basic user object
      // In a real app, you'd fetch from database
      const user = new User(decoded.email, '', '', '');
      user.id = decoded.userId;

      req.user = user;
      next();
    } catch (jwtError) {
      res.status(403).json({
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error during authentication'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No token provided, continue without user
      next();
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured');
      next(); // Continue without authentication
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Create basic user object
      const user = new User(decoded.email, '', '', '');
      user.id = decoded.userId;

      req.user = user;
      next();
    } catch (jwtError) {
      // Invalid token, continue without user
      next();
    }
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    next(); // Continue without authentication on error
  }
};

// Admin role check middleware
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
    return;
  }

  // For now, we'll assume all authenticated users have admin privileges
  // In a real application, you'd check user roles from database
  next();
};

// Rate limiting for authentication endpoints
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting for successful requests
    return req.method === 'GET';
  }
};
