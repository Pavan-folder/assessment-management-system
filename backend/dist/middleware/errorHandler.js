"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorProd = exports.sendErrorDev = exports.notFound = exports.handleValidationErrors = exports.catchAsync = exports.errorHandler = exports.AppError = void 0;
// Custom error class
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Error handler middleware
const errorHandler = (err, req, res, next) => {
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
    if (err.name === 'MongoError' && err.code === 11000) {
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
        }
        else {
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
exports.errorHandler = errorHandler;
// Async error wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = [];
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
exports.handleValidationErrors = handleValidationErrors;
// 404 error handler
const notFound = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFound = notFound;
// Development error response
const sendErrorDev = (err, res) => {
    return res.status(err.statusCode || 500).json({
        error: err.message,
        stack: err.stack,
        status: err.statusCode,
        statusText: res.statusMessage
    });
};
exports.sendErrorDev = sendErrorDev;
// Production error response
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode || 500).json({
            error: err.message,
            status: err.statusCode
        });
    }
    else {
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        return res.status(500).json({
            error: 'Something went wrong!',
            status: 500
        });
    }
};
exports.sendErrorProd = sendErrorProd;
//# sourceMappingURL=errorHandler.js.map