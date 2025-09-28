import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Chưa xác thực'
            });
            return;
        }

        const allowedRoles = ['admin', 'super_admin'];
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập'
            });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi kiểm tra quyền admin'
        });
        return;
    }
};
