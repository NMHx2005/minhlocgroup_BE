import rateLimit from 'express-rate-limit';

// General rate limiter - More lenient for development
export const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // limit each IP to 1000 requests per minute
    message: {
        success: false,
        message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 1 phút'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting in development
        return process.env.NODE_ENV === 'development' || true; // Always skip for now
    }
});

// Auth rate limiter - More lenient for development
export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // limit each IP to 50 requests per minute
    message: {
        success: false,
        message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 1 phút'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting in development
        return process.env.NODE_ENV === 'development' || true; // Always skip for now
    }
});

// Contact form rate limiter
export const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 contact requests per hour
    message: {
        success: false,
        message: 'Quá nhiều yêu cầu liên hệ, vui lòng thử lại sau 1 giờ'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Newsletter subscription rate limiter
export const newsletterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 newsletter subscriptions per hour
    message: {
        success: false,
        message: 'Quá nhiều lần đăng ký nhận tin, vui lòng thử lại sau 1 giờ'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 file uploads per hour
    message: {
        success: false,
        message: 'Quá nhiều file upload, vui lòng thử lại sau 1 giờ'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 API requests per windowMs
    message: {
        success: false,
        message: 'Quá nhiều yêu cầu API, vui lòng thử lại sau 15 phút'
    },
    standardHeaders: true,
    legacyHeaders: false
});
