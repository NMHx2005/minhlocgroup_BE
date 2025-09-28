import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Tài nguyên không tồn tại';
        error = { message, statusCode: 404 } as AppError;
    }

    // Mongoose duplicate key
    if (err.name === 'MongoError' && (err as any).code === 11000) {
        const message = 'Dữ liệu đã tồn tại';
        error = { message, statusCode: 400 } as AppError;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
        error = { message, statusCode: 400 } as AppError;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token không hợp lệ';
        error = { message, statusCode: 401 } as AppError;
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token đã hết hạn';
        error = { message, statusCode: 401 } as AppError;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Lỗi máy chủ',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Không tìm thấy ${req.originalUrl}`) as AppError;
    error.statusCode = 404;
    next(error);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};