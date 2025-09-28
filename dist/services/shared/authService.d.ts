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
declare class AuthService {
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    private readonly REFRESH_TOKEN_EXPIRES_IN;
    login(email: string, password: string, ipAddress: string, userAgent: string): Promise<LoginResult>;
    register(userData: any): Promise<RegisterResult>;
    logout(userId: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, updateData: any): Promise<any>;
    verifyEmail(token: string): Promise<void>;
    resendVerification(email: string): Promise<void>;
    private generateAccessToken;
    private generateRefreshToken;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=authService.d.ts.map