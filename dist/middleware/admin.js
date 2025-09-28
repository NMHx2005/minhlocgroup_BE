"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi kiểm tra quyền admin'
        });
        return;
    }
};
exports.adminMiddleware = adminMiddleware;
