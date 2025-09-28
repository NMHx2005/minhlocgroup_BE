import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../config/app';
import { AppError } from '../types';

/**
 * CORS configuration
 */
export const corsOptions = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (appConfig.allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new AppError('Not allowed by CORS', 403));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-Access-Token',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
});

/**
 * Security headers with Helmet
 */
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
            scriptSrc: ["'self'", 'https:'],
            imgSrc: ["'self'", 'data:', 'https:', 'http:'],
            connectSrc: ["'self'", 'https:', 'wss:'],
            fontSrc: ["'self'", 'https:', 'data:'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", 'https:'],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // Disable for file uploads
});

/**
 * Rate limiting configuration
 */
export const rateLimiter = rateLimit({
    windowMs: appConfig.rateLimit.windowMs,
    max: appConfig.rateLimit.maxRequests,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
        // Skip rate limiting for development
        return appConfig.env === 'development';
    },
});

/**
 * Strict rate limiting for auth endpoints
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later',
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

/**
 * API rate limiting for upload endpoints
 */
export const uploadRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 uploads per window
    message: {
        success: false,
        message: 'Too many file uploads, please try again later',
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    // Log request
    console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(
            `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`,
        );
    });

    next();
};

/**
 * Content-Type validation
 */
export const validateContentType = (allowedTypes: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (req.method === 'GET' || req.method === 'DELETE') {
            return next();
        }

        const contentType = req.get('Content-Type');
        if (!contentType) {
            return next(new AppError('Content-Type header is required', 400));
        }

        const isValidType = allowedTypes.some(type => contentType.includes(type));
        if (!isValidType) {
            return next(
                new AppError(
                    `Invalid Content-Type. Allowed types: ${allowedTypes.join(', ')}`,
                    400,
                ),
            );
        }

        next();
    };
};

/**
 * Request size limiter
 */
export const requestSizeLimiter = (maxSize: string = '10mb') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const contentLength = req.get('Content-Length');
        if (contentLength) {
            const sizeInBytes = parseInt(contentLength, 10);
            const maxSizeInBytes = parseSize(maxSize);

            if (sizeInBytes > maxSizeInBytes) {
                return next(new AppError(`Request too large. Maximum size is ${maxSize}`, 413));
            }
        }
        next();
    };
};

/**
 * Parse size string to bytes
 */
function parseSize(size: string): number {
    const units: { [key: string]: number } = {
        b: 1,
        kb: 1024,
        mb: 1024 * 1024,
        gb: 1024 * 1024 * 1024,
    };

    const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)(b|kb|mb|gb)$/);
    if (!match) {
        throw new Error('Invalid size format');
    }

    const [, value, unit] = match;
    if (!value || !unit) {
        throw new Error('Invalid size format');
    }
    return parseFloat(value) * (units[unit] ?? 1);
}

export default {
    corsOptions,
    securityHeaders,
    rateLimiter,
    authRateLimiter,
    uploadRateLimiter,
    requestLogger,
    validateContentType,
    requestSizeLimiter,
};
