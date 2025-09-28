import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const uploadImage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const uploadDocument: (req: AuthRequest, res: Response) => Promise<void>;
export declare const uploadVideo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFiles: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFileById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteFile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const downloadFile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFileStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=fileController.d.ts.map