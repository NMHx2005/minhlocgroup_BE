"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const database_1 = require("./config/database");
const error_1 = require("./middleware/error");
const rateLimit_1 = require("./middleware/rateLimit");
const app_1 = require("./config/app");
const dashboard_1 = __importDefault(require("./routes/admin/dashboard"));
const projects_1 = __importDefault(require("./routes/admin/projects"));
const products_1 = __importDefault(require("./routes/admin/products"));
const news_1 = __importDefault(require("./routes/admin/news"));
const newsCategories_1 = __importDefault(require("./routes/admin/newsCategories"));
const users_1 = __importDefault(require("./routes/admin/users"));
const contacts_1 = __importDefault(require("./routes/admin/contacts"));
const settings_1 = __importDefault(require("./routes/admin/settings"));
const company_1 = __importDefault(require("./routes/admin/company"));
const careers_1 = __importDefault(require("./routes/admin/careers"));
const businessFields_1 = __importDefault(require("./routes/admin/businessFields"));
const projects_2 = __importDefault(require("./routes/client/projects"));
const products_2 = __importDefault(require("./routes/client/products"));
const news_2 = __importDefault(require("./routes/client/news"));
const contacts_2 = __importDefault(require("./routes/client/contacts"));
const company_2 = __importDefault(require("./routes/client/company"));
const careers_2 = __importDefault(require("./routes/client/careers"));
const businessFields_2 = __importDefault(require("./routes/client/businessFields"));
const files_1 = __importDefault(require("./routes/shared/files"));
const analytics_1 = __importDefault(require("./routes/shared/analytics"));
const auth_1 = __importDefault(require("./routes/shared/auth"));
const app = (0, express_1.default)();
(0, database_1.connectDatabase)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use(rateLimit_1.generalLimiter);
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.use('/api/v1/admin/dashboard', dashboard_1.default);
app.use('/api/v1/admin/projects', projects_1.default);
app.use('/api/v1/admin/products', products_1.default);
app.use('/api/v1/admin/news', news_1.default);
app.use('/api/v1/admin/news-categories', newsCategories_1.default);
app.use('/api/v1/admin/users', users_1.default);
app.use('/api/v1/admin/contacts', contacts_1.default);
app.use('/api/v1/admin/settings', settings_1.default);
app.use('/api/v1/admin/company', company_1.default);
app.use('/api/v1/admin/careers', careers_1.default);
app.use('/api/v1/admin/business-fields', businessFields_1.default);
app.use('/api/v1/client/projects', projects_2.default);
app.use('/api/v1/client/products', products_2.default);
app.use('/api/v1/client/news', news_2.default);
app.use('/api/v1/client/contacts', contacts_2.default);
app.use('/api/v1/client/company', company_2.default);
app.use('/api/v1/client/careers', careers_2.default);
app.use('/api/v1/client/business-fields', businessFields_2.default);
app.use('/api/v1/uploads', files_1.default);
app.use('/api/v1/analytics', analytics_1.default);
app.use('/api/v1/auth', auth_1.default);
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
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'MinhLoc Group API',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});
app.get('/debug/jwt', (req, res) => {
    res.json({
        success: true,
        jwtSecret: app_1.appConfig.jwt.secret ? 'EXISTS' : 'MISSING',
        jwtSecretLength: app_1.appConfig.jwt.secret?.length || 0,
        jwtExpiresIn: app_1.appConfig.jwt.expiresIn,
        env: app_1.appConfig.env
    });
});
app.get('/debug/cloudinary', (req, res) => {
    res.json({
        success: true,
        cloudinary: {
            cloudName: app_1.appConfig.cloudinary.cloudName ? 'EXISTS' : 'MISSING',
            cloudNameValue: app_1.appConfig.cloudinary.cloudName,
            apiKey: app_1.appConfig.cloudinary.apiKey ? 'EXISTS' : 'MISSING',
            apiSecret: app_1.appConfig.cloudinary.apiSecret ? 'EXISTS' : 'MISSING'
        },
        env: app_1.appConfig.env
    });
});
app.use(error_1.notFound);
app.use(error_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map