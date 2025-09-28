export declare const careersService: {
    getJobPositions(options: {
        page: number;
        limit: number;
        department?: string;
        type?: string;
        search?: string;
    }): Promise<{
        positions: (import("mongoose").Document<unknown, {}, import("../../models/core/JobPosition").IJobPosition, {}, {}> & import("../../models/core/JobPosition").IJobPosition & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getJobPositionById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobPosition").IJobPosition, {}, {}> & import("../../models/core/JobPosition").IJobPosition & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getJobPositionBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobPosition").IJobPosition, {}, {}> & import("../../models/core/JobPosition").IJobPosition & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    submitJobApplication(data: any, ipAddress?: string, userAgent?: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobApplication").IJobApplication, {}, {}> & import("../../models/core/JobApplication").IJobApplication & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getDepartments(): Promise<{
        value: string;
        label: string;
    }[]>;
};
//# sourceMappingURL=careersService.d.ts.map