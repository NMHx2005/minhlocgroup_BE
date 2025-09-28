import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare const createContactMessage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createConsultationRequest: (req: AuthRequest, res: Response) => Promise<void>;
export declare const subscribeNewsletter: (req: Request, res: Response) => Promise<void>;
export declare const unsubscribeNewsletter: (req: Request, res: Response) => Promise<void>;
export declare const verifyNewsletterSubscription: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=contactController.d.ts.map