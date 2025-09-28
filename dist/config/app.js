"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(__dirname, '../../.env');
const cwdPath = path_1.default.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
console.log('File exists:', require('fs').existsSync(envPath));
console.log('CWD .env path:', cwdPath);
console.log('CWD .env exists:', require('fs').existsSync(cwdPath));
dotenv_1.default.config({ path: envPath });
dotenv_1.default.config({ path: cwdPath });
console.log('Environment Variables Debug:', {
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET ? 'EXISTS' : 'MISSING',
    JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    PORT: process.env.PORT,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'EXISTS' : 'MISSING',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'EXISTS' : 'MISSING',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'EXISTS' : 'MISSING'
});
exports.appConfig = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    apiVersion: process.env.API_VERSION || 'v1',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    bcrypt: {
        rounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'duxqgwlw7',
        apiKey: process.env.CLOUDINARY_API_KEY || '911123791758111',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '4hV_FwLT6BBvYk5lRrhYBqsiU08',
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
        allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'application/pdf',
        ],
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    email: process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    } : undefined,
    swagger: {
        title: process.env.SWAGGER_TITLE || 'MinhLoc API',
        description: process.env.SWAGGER_DESCRIPTION || 'API Documentation for MinhLoc Platform',
        version: process.env.SWAGGER_VERSION || '1.0.0',
    },
};
exports.default = exports.appConfig;
//# sourceMappingURL=app.js.map