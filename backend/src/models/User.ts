import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User as UserType } from '../types';

export class User implements UserType {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(email: string, password: string, firstName: string, lastName: string) {
    this.id = uuidv4();
    this.email = email.toLowerCase().trim();
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.password = password; // Will be hashed before saving
  }

  // Hash password before saving
  async hashPassword(): Promise<void> {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  // Verify password
  async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  // Update user information
  updateProfile(firstName: string, lastName: string): void {
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.updatedAt = new Date();
  }

  // Get full name
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Get user data without password
  toSafeJSON(): Omit<UserType, 'password'> {
    const { password, ...safeUser } = this;
    return safeUser;
  }

  // Static method to create user from database record
  static fromDatabase(record: any): User {
    const user = new User(record.email, record.password, record.firstName, record.lastName);
    user.id = record.id;
    user.createdAt = new Date(record.createdAt);
    user.updatedAt = new Date(record.updatedAt);
    return user;
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static isValidPassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

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
  static validate(userData: { email: string; password: string; firstName: string; lastName: string }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

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
