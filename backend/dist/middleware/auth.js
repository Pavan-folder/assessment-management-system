"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = exports.requireAdmin = exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
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
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // Here you would typically fetch the user from database
            // For now, we'll create a basic user object
            const user = new User_1.User(decoded.email, '', '', '');
            user.id = decoded.userId;
            req.user = user;
            next();
        }
        catch (jwtError) {
            res.status(403).json({
                error: 'Invalid token',
                message: 'Token verification failed'
            });
        }
    }
    catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({
            error: 'Authentication error',
            message: 'Internal server error during authentication'
        });
    }
};
exports.authenticateToken = authenticateToken;
// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
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
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // Create basic user object
            const user = new User_1.User(decoded.email, '', '', '');
            user.id = decoded.userId;
            req.user = user;
            next();
        }
        catch (jwtError) {
            // Invalid token, continue without user
            next();
        }
    }
    catch (error) {
        console.error('Optional authentication middleware error:', error);
        next(); // Continue without authentication on error
    }
};
exports.optionalAuth = optionalAuth;
// Admin role check middleware
const requireAdmin = (req, res, next) => {
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
exports.requireAdmin = requireAdmin;
// Rate limiting for authentication endpoints
exports.authRateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for successful requests
        return req.method === 'GET';
    }
};
//# sourceMappingURL=auth.js.map