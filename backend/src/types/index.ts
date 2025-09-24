// Assessment Management System - Type Definitions

import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  email: string;
  password: string;
  user?: any;
}

export interface RegisterRequest extends Request {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token?: string;
}

export interface ReportRequest extends Request {
  session_id: string;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  reportPath?: string;
  downloadUrl?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
