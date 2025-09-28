import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const getProjects: (req: Request, res: Response) => Promise<void>;
export declare const getProjectById: (req: Request, res: Response) => Promise<void>;
export declare const createProject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProject: (req: Request, res: Response) => Promise<void>;
export declare const uploadGalleryImages: (req: Request, res: Response) => Promise<void>;
export declare const deleteGalleryImage: (req: Request, res: Response) => Promise<void>;
export declare const addGalleryImageUrl: (req: Request, res: Response) => Promise<void>;
export declare const getProjectTypes: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=projectController.d.ts.map