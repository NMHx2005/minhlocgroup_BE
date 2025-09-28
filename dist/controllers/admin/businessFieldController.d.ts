import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const getBusinessFields: (req: Request, res: Response) => Promise<void>;
export declare const getBusinessFieldById: (req: Request, res: Response) => Promise<void>;
export declare const createBusinessField: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBusinessField: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteBusinessField: (req: Request, res: Response) => Promise<void>;
export declare const updateBusinessFieldSortOrder: (req: Request, res: Response) => Promise<void>;
export declare const toggleBusinessFieldStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=businessFieldController.d.ts.map