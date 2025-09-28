export interface UserFilters {
    search?: string;
    role?: string;
    status?: string;
    type?: string;
}
export interface UserListResult {
    users: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export interface ActivityLogFilters {
    userId?: string;
    action?: string;
    resourceType?: string;
}
export interface ActivityLogListResult {
    logs: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
declare class UserService {
    getUsers(page: number, limit: number, filters: UserFilters): Promise<UserListResult>;
    getUserById(id: string): Promise<any>;
    createUser(userData: any): Promise<any>;
    updateUser(id: string, updateData: any): Promise<any>;
    deleteUser(id: string): Promise<boolean>;
    getRoles(): Promise<any[]>;
    createRole(roleData: any): Promise<any>;
    updateRole(id: string, updateData: any): Promise<any>;
    deleteRole(id: string): Promise<boolean>;
    getPermissions(): Promise<any[]>;
    assignUserRoles(userId: string, roleIds: string[]): Promise<any>;
    getActivityLogs(page: number, limit: number, filters: ActivityLogFilters): Promise<ActivityLogListResult>;
    getActivityLogsByUser(userId: string, page: number, limit: number): Promise<ActivityLogListResult>;
    cleanupActivityLogs(days: number): Promise<number>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=userService.d.ts.map