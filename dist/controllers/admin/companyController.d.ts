import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const getCompanyInfo: (req: Request, res: Response) => Promise<void>;
export declare const createOrUpdateCompanyInfo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCompanyInfo: (req: Request, res: Response) => Promise<void>;
export declare const updateCompanyInfoSortOrder: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=companyController.d.ts.map