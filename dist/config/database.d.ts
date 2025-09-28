export interface DatabaseConfig {
    url: string;
    options?: Record<string, any>;
}
export declare const databaseConfig: DatabaseConfig;
export declare const connectDatabase: () => Promise<void>;
export declare const disconnectDatabase: () => Promise<void>;
export default databaseConfig;
//# sourceMappingURL=database.d.ts.map