import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const getNews: (req: Request, res: Response) => Promise<void>;
export declare const getNewsById: (req: Request, res: Response) => Promise<void>;
export declare const createNews: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateNews: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteNews: (req: AuthRequest, res: Response) => Promise<void>;
export declare const publishNews: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getNewsCategories: (req: Request, res: Response) => Promise<void>;
export declare const createNewsCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateNewsCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteNewsCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getNewsTags: (req: Request, res: Response) => Promise<void>;
export declare const createNewsTag: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateNewsTag: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteNewsTag: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=newsController.d.ts.map