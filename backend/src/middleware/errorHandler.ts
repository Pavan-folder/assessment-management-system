import { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError } from '../types';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    error = new AppError(message, 400);
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = 'Invalid input data';
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // File upload errors
  if (err.name === 'MulterError') {
    if (err.message === 'File too large') {
      const message = 'File size too large';
      error = new AppError(message, 400);
    } else {
      const message = 'File upload error';
      error = new AppError(message, 400);
    }
  }

  // Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: 'Application Error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Async error wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const errors: ValidationError[] = [];

  // Check for common validation errors
  if (!req.body) {
    errors.push({
      field: 'body',
      message: 'Request body is required'
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      errors
    });
  }

  next();
};

// 404 error handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Development error response
export const sendErrorDev = (err: AppError, res: Response): Response => {
  return res.status(err.statusCode || 500).json({
    error: err.message,
    stack: err.stack,
    status: err.statusCode,
    statusText: res.statusMessage
  });
};

// Production error response
export const sendErrorProd = (err: AppError, res: Response): Response => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      error: err.message,
      status: err.statusCode
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(500).json({
      error: 'Something went wrong!',
      status: 500
    });
  }
};
