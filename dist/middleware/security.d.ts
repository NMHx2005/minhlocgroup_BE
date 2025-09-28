import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
export declare const corsOptions: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
export declare const securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const rateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const uploadRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateContentType: (allowedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requestSizeLimiter: (maxSize?: string) => (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    corsOptions: (req: cors.CorsRequest, res: {
        statusCode?: number | undefined;
        setHeader(key: string, value: string): any;
        end(): any;
    }, next: (err?: any) => any) => void;
    securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
    rateLimiter: import("express-rate-limit").RateLimitRequestHandler;
    authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
    uploadRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
    requestLogger: (req: Request, res: Response, next: NextFunction) => void;
    validateContentType: (allowedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => void;
    requestSizeLimiter: (maxSize?: string) => (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=security.d.ts.map