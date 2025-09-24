"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
exports.authRoutes = router;
// Rate limiting for auth endpoints
const authLimiter = (0, express_rate_limit_1.default)(auth_1.authRateLimit);
// Register new user
router.post('/register', authLimiter, [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
    (0, express_validator_1.body)('firstName').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('lastName').trim().isLength({ min: 2 })
], (0, errorHandler_1.catchAsync)(async (req, res) => {
    // Check validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const { email, password, firstName, lastName } = req.body;
    // Validate user data
    const validation = User_1.User.validate({ email, password, firstName, lastName });
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
    const user = new User_1.User(email, password, firstName, lastName);
    await user.hashPassword();
    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET not configured');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });
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
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty()
], (0, errorHandler_1.catchAsync)(async (req, res) => {
    // Check validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    const { email, password } = req.body;
    // Find user (in a real app, this would be from database)
    // For now, we'll simulate user lookup
    const user = new User_1.User(email, '', '', '');
    user.id = 'simulated-user-id';
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
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });
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
router.get('/profile', auth_1.authenticateToken, (req, res) => {
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
router.post('/refresh', auth_1.authenticateToken, (req, res) => {
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
    const token = jsonwebtoken_1.default.sign({ userId: req.user.id, email: req.user.email }, secret, { expiresIn: '7d' });
    res.json({
        success: true,
        message: 'Token refreshed successfully',
        token
    });
});
// Logout (client-side token removal)
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});
//# sourceMappingURL=auth.js.map