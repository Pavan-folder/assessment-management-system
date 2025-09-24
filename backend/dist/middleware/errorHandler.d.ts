import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number, isOperational?: boolean);
}
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => Response | void;
export declare const catchAsync: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => Response | void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const sendErrorDev: (err: AppError, res: Response) => Response;
export declare const sendErrorProd: (err: AppError, res: Response) => Response;
//# sourceMappingURL=errorHandler.d.ts.map