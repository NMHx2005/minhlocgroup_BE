import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
export declare const getUserById: (req: Request, res: Response) => Promise<void>;
export declare const createUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getRoles: (req: Request, res: Response) => Promise<void>;
export declare const createRole: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateRole: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteRole: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPermissions: (req: Request, res: Response) => Promise<void>;
export declare const assignUserRoles: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getActivityLogs: (req: Request, res: Response) => Promise<void>;
export declare const getActivityLogsByUser: (req: Request, res: Response) => Promise<void>;
export declare const cleanupActivityLogs: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map