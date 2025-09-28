import { Request, Response } from 'express';
export declare const getNews: (req: Request, res: Response) => Promise<void>;
export declare const getNewsById: (req: Request, res: Response) => Promise<void>;
export declare const getNewsBySlug: (req: Request, res: Response) => Promise<void>;
export declare const getFeaturedNews: (req: Request, res: Response) => Promise<void>;
export declare const getLatestNews: (req: Request, res: Response) => Promise<void>;
export declare const getNewsByCategory: (req: Request, res: Response) => Promise<void>;
export declare const searchNews: (req: Request, res: Response) => Promise<void>;
export declare const getNewsCategories: (req: Request, res: Response) => Promise<void>;
export declare const getNewsTags: (req: Request, res: Response) => Promise<void>;
export declare const getRelatedNews: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=newsController.d.ts.map