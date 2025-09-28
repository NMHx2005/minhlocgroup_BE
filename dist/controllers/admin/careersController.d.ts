import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const getJobPositions: (req: Request, res: Response) => Promise<void>;
export declare const getJobPositionById: (req: Request, res: Response) => Promise<void>;
export declare const createJobPosition: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateJobPosition: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteJobPosition: (req: Request, res: Response) => Promise<void>;
export declare const getJobApplications: (req: Request, res: Response) => Promise<void>;
export declare const getJobApplicationById: (req: Request, res: Response) => Promise<void>;
export declare const updateJobApplicationStatus: (req: Request, res: Response) => Promise<void>;
export declare const getCareersStatistics: (req: Request, res: Response) => Promise<void>;
export declare const getDepartments: (req: Request, res: Response) => Promise<void>;
export declare const submitJobApplication: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=careersController.d.ts.map