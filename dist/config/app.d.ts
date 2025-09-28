export interface AppConfig {
    env: string;
    port: number;
    apiVersion: string;
    corsOrigin: string;
    allowedOrigins: string[];
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    bcrypt: {
        rounds: number;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    upload: {
        maxFileSize: number;
        allowedTypes: string[];
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    email: {
        host: string;
        port: number;
        user: string;
        pass: string;
    } | undefined;
    swagger: {
        title: string;
        description: string;
        version: string;
    };
}
export declare const appConfig: AppConfig;
export default appConfig;
//# sourceMappingURL=app.d.ts.map