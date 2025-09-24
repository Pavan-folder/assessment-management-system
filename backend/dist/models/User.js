"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
class User {
    constructor(email, password, firstName, lastName) {
        this.id = (0, uuid_1.v4)();
        this.email = email.toLowerCase().trim();
        this.firstName = firstName.trim();
        this.lastName = lastName.trim();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.password = password; // Will be hashed before saving
    }
    // Hash password before saving
    async hashPassword() {
        const saltRounds = 12;
        this.password = await bcryptjs_1.default.hash(this.password, saltRounds);
    }
    // Verify password
    async verifyPassword(password) {
        return await bcryptjs_1.default.compare(password, this.password);
    }
    // Update user information
    updateProfile(firstName, lastName) {
        this.firstName = firstName.trim();
        this.lastName = lastName.trim();
        this.updatedAt = new Date();
    }
    // Get full name
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    // Get user data without password
    toSafeJSON() {
        const { password, ...safeUser } = this;
        return safeUser;
    }
    // Static method to create user from database record
    static fromDatabase(record) {
        const user = new User(record.email, record.password, record.firstName, record.lastName);
        user.id = record.id;
        user.createdAt = new Date(record.createdAt);
        user.updatedAt = new Date(record.updatedAt);
        return user;
    }
    // Validate email format
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Validate password strength
    static isValidPassword(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Validate user data
    static validate(userData) {
        const errors = [];
        // Email validation
        if (!userData.email || !this.isValidEmail(userData.email)) {
            errors.push('Valid email is required');
        }
        // Password validation
        const passwordValidation = this.isValidPassword(userData.password);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }
        // Name validation
        if (!userData.firstName || userData.firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters long');
        }
        if (!userData.lastName || userData.lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters long');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map