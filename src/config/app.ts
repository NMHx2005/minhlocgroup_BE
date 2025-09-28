import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the project root
const envPath = path.resolve(__dirname, '../../.env');
const cwdPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
console.log('File exists:', require('fs').existsSync(envPath));
console.log('CWD .env path:', cwdPath);
console.log('CWD .env exists:', require('fs').existsSync(cwdPath));

// Try loading from both paths
dotenv.config({ path: envPath });
dotenv.config({ path: cwdPath });

export interface AppConfig {
    env: string;
    port: number;
    apiVersion: string;
    corsOrigin: string;
    allowedOrigins: string[];
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    bcrypt: {
        rounds: number;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    upload: {
        maxFileSize: number;
        allowedTypes: string[];
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    email: {
        host: string;
        port: number;
        user: string;
        pass: string;
    } | undefined;
    swagger: {
        title: string;
        description: string;
        version: string;
    };
}

// Debug environment variables
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

export const appConfig: AppConfig = {
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
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
        allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'application/pdf',
        ],
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
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

export default appConfig;
