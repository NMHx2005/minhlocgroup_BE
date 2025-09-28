"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const core_1 = require("@/models/core");
const app_1 = require("@/config/app");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') ||
            req.cookies?.token;
        console.log('Auth Middleware Debug:', {
            hasToken: !!token,
            tokenLength: token?.length,
            tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
            jwtSecret: app_1.appConfig.jwt.secret ? 'EXISTS' : 'MISSING',
            jwtSecretLength: app_1.appConfig.jwt.secret?.length,
            url: req.url,
            method: req.method
        });
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Không có token xác thực'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, app_1.appConfig.jwt.secret);
        console.log('JWT Decoded:', {
            userId: decoded.userId || decoded.id,
            email: decoded.email,
            role: decoded.role,
            iat: decoded.iat,
            exp: decoded.exp
        });
        const userId = decoded.userId || decoded.id;
        const user = await core_1.User.findById(userId).select('-password');
        console.log('User found:', {
            userId: user?._id,
            email: user?.email,
            status: user?.status,
            role: user?.role
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Token không hợp lệ'
            });
            return;
        }
        if (user.status !== 'active') {
            res.status(401).json({
                success: false,
                message: 'Tài khoản đã bị vô hiệu hóa'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
        return;
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map