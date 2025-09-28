import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare const getNewsCategories: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getActiveNewsCategories: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getNewsCategoryById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createNewsCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateNewsCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteNewsCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCategoryStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleCategoryStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateSortOrder: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=newsCategoryController.d.ts.map