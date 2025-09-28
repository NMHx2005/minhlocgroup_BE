import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@/models/core';
import { emailService } from './emailService';
import { appConfig } from '@/config/app';

export interface LoginResult {
    user: any;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterResult {
    user: any;
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    private readonly JWT_SECRET = appConfig.jwt.secret;
    private readonly JWT_EXPIRES_IN = appConfig.jwt.expiresIn;
    private readonly REFRESH_TOKEN_EXPIRES_IN = appConfig.jwt.refreshExpiresIn;

    /**
     * User login
     */
    async login(email: string, password: string, ipAddress: string, userAgent: string): Promise<LoginResult> {
        try {
            // Find user by email
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                throw new Error('Email hoặc mật khẩu không đúng');
            }

            // Check if user is active
            if (user.status !== 'active') {
                throw new Error('Tài khoản đã bị khóa hoặc chưa được kích hoạt');
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Email hoặc mật khẩu không đúng');
            }

            // Update last activity
            user.lastActivity = new Date();
            await user.save();

            // Generate tokens
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            // Remove password from response
            const userResponse = user.toObject();
            delete (userResponse as any).password;

            return {
                user: userResponse,
                accessToken,
                refreshToken
            };
        } catch (error) {
            throw new Error(`Lỗi khi đăng nhập: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * User registration
     */
    async register(userData: any): Promise<RegisterResult> {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Email đã được sử dụng');
            }

            // Create new user
            const user = new User({
                ...userData,
                status: 'active' // Auto-activate for now
            });

            await user.save();

            // Generate tokens
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            // Remove password from response
            const userResponse = user.toObject();
            delete (userResponse as any).password;

            return {
                user: userResponse,
                accessToken,
                refreshToken
            };
        } catch (error) {
            throw new Error(`Lỗi khi đăng ký: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * User logout
     */
    async logout(userId: string): Promise<void> {
        try {
            // Update last activity
            await User.findByIdAndUpdate(userId, { lastActivity: new Date() });
        } catch (error) {
            throw new Error(`Lỗi khi đăng xuất: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as any;

            // Find user
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('Token không hợp lệ');
            }

            // Check if user is still active
            if (user.status !== 'active') {
                throw new Error('Tài khoản đã bị khóa');
            }

            // Generate new access token
            const accessToken = this.generateAccessToken(user);

            return { accessToken };
        } catch (error) {
            throw new Error(`Lỗi khi làm mới token: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Forgot password
     */
    async forgotPassword(email: string): Promise<void> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Email không tồn tại');
            }

            // Generate reset token
            const resetToken = jwt.sign(
                { userId: user._id, email: user.email },
                this.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // TODO: Send reset password email
            // await emailService.sendResetPasswordEmail(user.email, resetToken);

            console.log(`Reset password token for ${email}: ${resetToken}`);
        } catch (error) {
            throw new Error(`Lỗi khi gửi email khôi phục mật khẩu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Reset password
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            // Verify reset token
            const decoded = jwt.verify(token, this.JWT_SECRET) as any;

            // Find user
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('Token không hợp lệ');
            }

            // Update password
            user.password = newPassword;
            await user.save();
        } catch (error) {
            throw new Error(`Lỗi khi đặt lại mật khẩu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Change password
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        try {
            const user = await User.findById(userId).select('+password');
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }

            // Verify current password
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                throw new Error('Mật khẩu hiện tại không đúng');
            }

            // Update password
            user.password = newPassword;
            await user.save();
        } catch (error) {
            throw new Error(`Lỗi khi đổi mật khẩu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get user profile
     */
    async getProfile(userId: string): Promise<any> {
        try {
            const user = await User.findById(userId)
                .populate('roles', 'name displayName')
                .select('-password')
                .lean();

            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }

            return user;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updateData: any): Promise<any> {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            )
                .populate('roles', 'name displayName')
                .select('-password')
                .lean();

            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }

            return user;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Verify email
     */
    async verifyEmail(token: string): Promise<void> {
        try {
            // Verify token
            const decoded = jwt.verify(token, this.JWT_SECRET) as any;

            // Find user
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('Token không hợp lệ');
            }

            // Update user status
            user.status = 'active';
            await user.save();
        } catch (error) {
            throw new Error(`Lỗi khi xác thực email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Resend verification email
     */
    async resendVerification(email: string): Promise<void> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Email không tồn tại');
            }

            if (user.status === 'active') {
                throw new Error('Email đã được xác thực');
            }

            // Generate verification token
            const verificationToken = jwt.sign(
                { userId: user._id, email: user.email },
                this.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // TODO: Send verification email
            // await emailService.sendVerificationEmail(user.email, verificationToken);

            console.log(`Verification token for ${email}: ${verificationToken}`);
        } catch (error) {
            throw new Error(`Lỗi khi gửi lại email xác thực: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate access token
     */
    private generateAccessToken(user: any): string {
        console.log('AuthService - Generating token with:', {
            jwtSecret: this.JWT_SECRET ? 'EXISTS' : 'MISSING',
            jwtSecretLength: this.JWT_SECRET?.length,
            jwtExpiresIn: this.JWT_EXPIRES_IN,
            userId: user._id,
            email: user.email,
            role: user.role
        });

        return (jwt as any).sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
                roles: user.roles
            },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }

    /**
     * Generate refresh token
     */
    private generateRefreshToken(user: any): string {
        return (jwt as any).sign(
            { userId: user._id },
            this.JWT_SECRET,
            { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
        );
    }
}

export const authService = new AuthService();
