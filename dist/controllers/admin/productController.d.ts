import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const getProducts: (req: Request, res: Response) => Promise<void>;
export declare const getProductById: (req: Request, res: Response) => Promise<void>;
export declare const createProduct: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProduct: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProduct: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCategories: (req: Request, res: Response) => Promise<void>;
export declare const createCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getOrigins: (req: Request, res: Response) => Promise<void>;
export declare const createOrigin: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateOrigin: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteOrigin: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=productController.d.ts.map