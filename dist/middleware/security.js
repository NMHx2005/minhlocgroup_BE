"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSizeLimiter = exports.validateContentType = exports.requestLogger = exports.uploadRateLimiter = exports.authRateLimiter = exports.rateLimiter = exports.securityHeaders = exports.corsOptions = void 0;
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app_1 = require("@/config/app");
const types_1 = require("@/types");
exports.corsOptions = (0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (app_1.appConfig.allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new types_1.AppError('Not allowed by CORS', 403));
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
exports.securityHeaders = (0, helmet_1.default)({
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
    crossOriginEmbedderPolicy: false,
});
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: app_1.appConfig.rateLimit.windowMs,
    max: app_1.appConfig.rateLimit.maxRequests,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return app_1.appConfig.env === 'development';
    },
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later',
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});
exports.uploadRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many file uploads, please try again later',
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
    });
    next();
};
exports.requestLogger = requestLogger;
const validateContentType = (allowedTypes) => {
    return (req, res, next) => {
        if (req.method === 'GET' || req.method === 'DELETE') {
            return next();
        }
        const contentType = req.get('Content-Type');
        if (!contentType) {
            return next(new types_1.AppError('Content-Type header is required', 400));
        }
        const isValidType = allowedTypes.some(type => contentType.includes(type));
        if (!isValidType) {
            return next(new types_1.AppError(`Invalid Content-Type. Allowed types: ${allowedTypes.join(', ')}`, 400));
        }
        next();
    };
};
exports.validateContentType = validateContentType;
const requestSizeLimiter = (maxSize = '10mb') => {
    return (req, res, next) => {
        const contentLength = req.get('Content-Length');
        if (contentLength) {
            const sizeInBytes = parseInt(contentLength, 10);
            const maxSizeInBytes = parseSize(maxSize);
            if (sizeInBytes > maxSizeInBytes) {
                return next(new types_1.AppError(`Request too large. Maximum size is ${maxSize}`, 413));
            }
        }
        next();
    };
};
exports.requestSizeLimiter = requestSizeLimiter;
function parseSize(size) {
    const units = {
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
exports.default = {
    corsOptions: exports.corsOptions,
    securityHeaders: exports.securityHeaders,
    rateLimiter: exports.rateLimiter,
    authRateLimiter: exports.authRateLimiter,
    uploadRateLimiter: exports.uploadRateLimiter,
    requestLogger: exports.requestLogger,
    validateContentType: exports.validateContentType,
    requestSizeLimiter: exports.requestSizeLimiter,
};
//# sourceMappingURL=security.js.map