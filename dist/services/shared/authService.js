"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const core_1 = require("@/models/core");
const app_1 = require("@/config/app");
class AuthService {
    constructor() {
        this.JWT_SECRET = app_1.appConfig.jwt.secret;
        this.JWT_EXPIRES_IN = app_1.appConfig.jwt.expiresIn;
        this.REFRESH_TOKEN_EXPIRES_IN = app_1.appConfig.jwt.refreshExpiresIn;
    }
    async login(email, password, ipAddress, userAgent) {
        try {
            const user = await core_1.User.findOne({ email }).select('+password');
            if (!user) {
                throw new Error('Email hoặc mật khẩu không đúng');
            }
            if (user.status !== 'active') {
                throw new Error('Tài khoản đã bị khóa hoặc chưa được kích hoạt');
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Email hoặc mật khẩu không đúng');
            }
            user.lastActivity = new Date();
            await user.save();
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);
            const userResponse = user.toObject();
            delete userResponse.password;
            return {
                user: userResponse,
                accessToken,
                refreshToken
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi đăng nhập: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async register(userData) {
        try {
            const existingUser = await core_1.User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Email đã được sử dụng');
            }
            const user = new core_1.User({
                ...userData,
                status: 'active'
            });
            await user.save();
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);
            const userResponse = user.toObject();
            delete userResponse.password;
            return {
                user: userResponse,
                accessToken,
                refreshToken
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi đăng ký: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async logout(userId) {
        try {
            await core_1.User.findByIdAndUpdate(userId, { lastActivity: new Date() });
        }
        catch (error) {
            throw new Error(`Lỗi khi đăng xuất: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, this.JWT_SECRET);
            const user = await core_1.User.findById(decoded.userId);
            if (!user) {
                throw new Error('Token không hợp lệ');
            }
            if (user.status !== 'active') {
                throw new Error('Tài khoản đã bị khóa');
            }
            const accessToken = this.generateAccessToken(user);
            return { accessToken };
        }
        catch (error) {
            throw new Error(`Lỗi khi làm mới token: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async forgotPassword(email) {
        try {
            const user = await core_1.User.findOne({ email });
            if (!user) {
                throw new Error('Email không tồn tại');
            }
            const resetToken = jwt.sign({ userId: user._id, email: user.email }, this.JWT_SECRET, { expiresIn: '1h' });
            console.log(`Reset password token for ${email}: ${resetToken}`);
        }
        catch (error) {
            throw new Error(`Lỗi khi gửi email khôi phục mật khẩu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            const user = await core_1.User.findById(decoded.userId);
            if (!user) {
                throw new Error('Token không hợp lệ');
            }
            user.password = newPassword;
            await user.save();
        }
        catch (error) {
            throw new Error(`Lỗi khi đặt lại mật khẩu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await core_1.User.findById(userId).select('+password');
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                throw new Error('Mật khẩu hiện tại không đúng');
            }
            user.password = newPassword;
            await user.save();
        }
        catch (error) {
            throw new Error(`Lỗi khi đổi mật khẩu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProfile(userId) {
        try {
            const user = await core_1.User.findById(userId)
                .populate('roles', 'name displayName')
                .select('-password')
                .lean();
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
            return user;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateProfile(userId, updateData) {
        try {
            const user = await core_1.User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
                .populate('roles', 'name displayName')
                .select('-password')
                .lean();
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
            return user;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async verifyEmail(token) {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            const user = await core_1.User.findById(decoded.userId);
            if (!user) {
                throw new Error('Token không hợp lệ');
            }
            user.status = 'active';
            await user.save();
        }
        catch (error) {
            throw new Error(`Lỗi khi xác thực email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async resendVerification(email) {
        try {
            const user = await core_1.User.findOne({ email });
            if (!user) {
                throw new Error('Email không tồn tại');
            }
            if (user.status === 'active') {
                throw new Error('Email đã được xác thực');
            }
            const verificationToken = jwt.sign({ userId: user._id, email: user.email }, this.JWT_SECRET, { expiresIn: '24h' });
            console.log(`Verification token for ${email}: ${verificationToken}`);
        }
        catch (error) {
            throw new Error(`Lỗi khi gửi lại email xác thực: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    generateAccessToken(user) {
        console.log('AuthService - Generating token with:', {
            jwtSecret: this.JWT_SECRET ? 'EXISTS' : 'MISSING',
            jwtSecretLength: this.JWT_SECRET?.length,
            jwtExpiresIn: this.JWT_EXPIRES_IN,
            userId: user._id,
            email: user.email,
            role: user.role
        });
        return jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role,
            roles: user.roles
        }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    }
    generateRefreshToken(user) {
        return jwt.sign({ userId: user._id }, this.JWT_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN });
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map