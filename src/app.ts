import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/error';
import { generalLimiter } from './middleware/rateLimit';
import { appConfig } from './config/app';

// Import routes
import adminDashboardRoutes from './routes/admin/dashboard';
import adminProjectRoutes from './routes/admin/projects';
import adminProductRoutes from './routes/admin/products';
import adminNewsRoutes from './routes/admin/news';
import adminNewsCategoriesRoutes from './routes/admin/newsCategories';
import adminUserRoutes from './routes/admin/users';
import adminContactRoutes from './routes/admin/contacts';
import adminSettingsRoutes from './routes/admin/settings';
import adminCompanyRoutes from './routes/admin/company';
import adminCareersRoutes from './routes/admin/careers';
import adminBusinessFieldsRoutes from './routes/admin/businessFields';

import clientProjectRoutes from './routes/client/projects';
import clientProductRoutes from './routes/client/products';
import clientNewsRoutes from './routes/client/news';
import clientContactRoutes from './routes/client/contacts';
import clientCompanyRoutes from './routes/client/company';
import clientCareersRoutes from './routes/client/careers';
import clientBusinessFieldsRoutes from './routes/client/businessFields';

import sharedFileRoutes from './routes/shared/files';
import sharedAnalyticsRoutes from './routes/shared/analytics';
import sharedAuthRoutes from './routes/shared/auth';

const app = express();

// Connect to database
connectDatabase();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use('/api/v1/admin/dashboard', adminDashboardRoutes);
app.use('/api/v1/admin/projects', adminProjectRoutes);
app.use('/api/v1/admin/products', adminProductRoutes);
app.use('/api/v1/admin/news', adminNewsRoutes);
app.use('/api/v1/admin/news-categories', adminNewsCategoriesRoutes);
app.use('/api/v1/admin/users', adminUserRoutes);
app.use('/api/v1/admin/contacts', adminContactRoutes);
app.use('/api/v1/admin/settings', adminSettingsRoutes);
app.use('/api/v1/admin/company', adminCompanyRoutes);
app.use('/api/v1/admin/careers', adminCareersRoutes);
app.use('/api/v1/admin/business-fields', adminBusinessFieldsRoutes);

app.use('/api/v1/client/projects', clientProjectRoutes);
app.use('/api/v1/client/products', clientProductRoutes);
app.use('/api/v1/client/news', clientNewsRoutes);
app.use('/api/v1/client/contacts', clientContactRoutes);
app.use('/api/v1/client/company', clientCompanyRoutes);
app.use('/api/v1/client/careers', clientCareersRoutes);
app.use('/api/v1/client/business-fields', clientBusinessFieldsRoutes);

app.use('/api/v1/uploads', sharedFileRoutes);
app.use('/api/v1/analytics', sharedAnalyticsRoutes);
app.use('/api/v1/auth', sharedAuthRoutes);

// API info endpoint
app.get('/api/v1', (req, res) => {
    res.json({
        success: true,
        message: 'MinhLoc Group API v1',
        version: '1.0.0',
        endpoints: {
            admin: {
                dashboard: '/api/v1/admin/dashboard',
                projects: '/api/v1/admin/projects',
                products: '/api/v1/admin/products',
                news: '/api/v1/admin/news',
                users: '/api/v1/admin/users',
                contacts: '/api/v1/admin/contacts',
                settings: '/api/v1/admin/settings',
                company: '/api/v1/admin/company',
                careers: '/api/v1/admin/careers',
                businessFields: '/api/v1/admin/business-fields'
            },
            client: {
                projects: '/api/v1/client/projects',
                products: '/api/v1/client/products',
                news: '/api/v1/client/news',
                contacts: '/api/v1/client/contacts',
                company: '/api/v1/client/company',
                careers: '/api/v1/client/careers',
                businessFields: '/api/v1/client/business-fields'
            },
            shared: {
                auth: '/api/v1/auth',
                uploads: '/api/v1/uploads',
                analytics: '/api/v1/analytics'
            }
        },
        documentation: '/api/docs'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'MinhLoc Group API',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});

// Debug endpoint to check JWT secret
app.get('/debug/jwt', (req, res) => {
    res.json({
        success: true,
        jwtSecret: appConfig.jwt.secret ? 'EXISTS' : 'MISSING',
        jwtSecretLength: appConfig.jwt.secret?.length || 0,
        jwtExpiresIn: appConfig.jwt.expiresIn,
        env: appConfig.env
    });
});

// Debug endpoint to check Cloudinary config
app.get('/debug/cloudinary', (req, res) => {
    res.json({
        success: true,
        cloudinary: {
            cloudName: appConfig.cloudinary.cloudName ? 'EXISTS' : 'MISSING',
            cloudNameValue: appConfig.cloudinary.cloudName,
            apiKey: appConfig.cloudinary.apiKey ? 'EXISTS' : 'MISSING',
            apiSecret: appConfig.cloudinary.apiSecret ? 'EXISTS' : 'MISSING'
        },
        env: appConfig.env
    });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;