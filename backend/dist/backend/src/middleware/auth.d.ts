import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
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
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authRateLimit: {
    windowMs: number;
    max: number;
    message: string;
    standardHeaders: boolean;
    legacyHeaders: boolean;
    skip: (req: Request) => boolean;
};
//# sourceMappingURL=auth.d.ts.map