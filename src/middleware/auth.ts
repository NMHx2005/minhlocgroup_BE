import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/core';
import { appConfig } from '@/config/app';

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') ||
            req.cookies?.token;

        // Debug: Log JWT secret and token info
        console.log('Auth Middleware Debug:', {
            hasToken: !!token,
            tokenLength: token?.length,
            tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
            jwtSecret: appConfig.jwt.secret ? 'EXISTS' : 'MISSING',
            jwtSecretLength: appConfig.jwt.secret?.length,
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

        const decoded = jwt.verify(token, appConfig.jwt.secret) as any;
        console.log('JWT Decoded:', {
            userId: decoded.userId || decoded.id,
            email: decoded.email,
            role: decoded.role,
            iat: decoded.iat,
            exp: decoded.exp
        });

        const userId = decoded.userId || decoded.id; // Support both userId and id
        const user = await User.findById(userId).select('-password');

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
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
        return;
    }
};