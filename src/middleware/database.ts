import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * Middleware to check database connection before processing requests
 */
export const checkDatabaseConnection = (req: Request, res: Response, next: NextFunction): void => {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({
            success: false,
            message: 'Database connection not ready',
            error: 'Database is not connected'
        });
        return;
    }
    next();
};
