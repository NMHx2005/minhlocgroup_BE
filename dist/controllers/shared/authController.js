"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerification = exports.verifyEmail = exports.updateProfile = exports.getProfile = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.logout = exports.register = exports.login = void 0;
const authService_1 = require("@/services/shared/authService");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService_1.authService.login(email, password, req.ip || '', req.get('User-Agent') || '');
        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: result
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Lỗi khi đăng nhập',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const userData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };
        const result = await authService_1.authService.register(userData);
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: result
        });
        ;
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi đăng ký',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.register = register;
const logout = async (req, res) => {
    try {
        await authService_1.authService.logout(req.user?.id);
        res.json({
            success: true,
            message: 'Đăng xuất thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng xuất',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.logout = logout;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService_1.authService.refreshToken(refreshToken);
        res.json({
            success: true,
            message: 'Làm mới token thành công',
            data: result
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Lỗi khi làm mới token',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.refreshToken = refreshToken;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await authService_1.authService.forgotPassword(email);
        res.json({
            success: true,
            message: 'Email khôi phục mật khẩu đã được gửi'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi email khôi phục mật khẩu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await authService_1.authService.resetPassword(token, newPassword);
        res.json({
            success: true,
            message: 'Đặt lại mật khẩu thành công'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi đặt lại mật khẩu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;
        await authService_1.authService.changePassword(userId, currentPassword, newPassword);
        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi đổi mật khẩu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.changePassword = changePassword;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const profile = await authService_1.authService.getProfile(userId);
        res.json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const updateData = req.body;
        const profile = await authService_1.authService.updateProfile(userId, updateData);
        res.json({
            success: true,
            message: 'Cập nhật profile thành công',
            data: profile
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateProfile = updateProfile;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        await authService_1.authService.verifyEmail(token);
        res.json({
            success: true,
            message: 'Xác thực email thành công'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi xác thực email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.verifyEmail = verifyEmail;
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        await authService_1.authService.resendVerification(email);
        res.json({
            success: true,
            message: 'Email xác thực đã được gửi lại'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi lại email xác thực',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.resendVerification = resendVerification;
//# sourceMappingURL=authController.js.map