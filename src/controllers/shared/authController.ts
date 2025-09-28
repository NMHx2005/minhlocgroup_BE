import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { authService } from '../../services/shared/authService';

/**
 * User login
 * POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password, req.ip || '', req.get('User-Agent') || '');

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: result
        });
    } catch (error) {res.status(401).json({
            success: false,
            message: 'Lỗi khi đăng nhập',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * User registration
 * POST /api/v1/auth/register
 */
export const register = async (req: Request, res: Response) => {
    try {
        const userData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        const result = await authService.register(userData);res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: result
        });;


        return;
    } catch (error) {res.status(400).json({
            success: false,
            message: 'Lỗi khi đăng ký',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * User logout
 * POST /api/v1/auth/logout
 */
export const logout = async (req: AuthRequest, res: Response) => {
    try {
        await authService.logout(req.user?.id);

        res.json({
            success: true,
            message: 'Đăng xuất thành công'
        });
    } catch (error) {res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng xuất',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Refresh access token
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const result = await authService.refreshToken(refreshToken);

        res.json({
            success: true,
            message: 'Làm mới token thành công',
            data: result
        });
    } catch (error) {res.status(401).json({
            success: false,
            message: 'Lỗi khi làm mới token',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Forgot password
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        await authService.forgotPassword(email);

        res.json({
            success: true,
            message: 'Email khôi phục mật khẩu đã được gửi'
        });
    } catch (error) {res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi email khôi phục mật khẩu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Reset password
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        await authService.resetPassword(token, newPassword);

        res.json({
            success: true,
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {res.status(400).json({
            success: false,
            message: 'Lỗi khi đặt lại mật khẩu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Change password
 * POST /api/v1/auth/change-password
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;

        await authService.changePassword(userId, currentPassword, newPassword);

        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {res.status(400).json({
            success: false,
            message: 'Lỗi khi đổi mật khẩu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get user profile
 * GET /api/v1/auth/profile
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const profile = await authService.getProfile(userId);

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update user profile
 * PUT /api/v1/auth/profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const updateData = req.body;

        const profile = await authService.updateProfile(userId, updateData);

        res.json({
            success: true,
            message: 'Cập nhật profile thành công',
            data: profile
        });
    } catch (error) {res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Verify email
 * POST /api/v1/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        await authService.verifyEmail(token);

        res.json({
            success: true,
            message: 'Xác thực email thành công'
        });
    } catch (error) {res.status(400).json({
            success: false,
            message: 'Lỗi khi xác thực email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Resend verification email
 * POST /api/v1/auth/resend-verification
 */
export const resendVerification = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        await authService.resendVerification(email);

        res.json({
            success: true,
            message: 'Email xác thực đã được gửi lại'
        });
    } catch (error) {res.status(400).json({
            success: false,
            message: 'Lỗi khi gửi lại email xác thực',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};
