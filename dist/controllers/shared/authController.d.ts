import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: AuthRequest, res: Response) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response) => Promise<void>;
export declare const changePassword: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const resendVerification: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map