export declare const careersService: {
    getJobPositions(options: {
        page: number;
        limit: number;
        department?: string;
        type?: string;
        status?: string;
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
    createJobPosition(data: any, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobPosition").IJobPosition, {}, {}> & import("../../models/core/JobPosition").IJobPosition & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateJobPosition(id: string, data: any, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobPosition").IJobPosition, {}, {}> & import("../../models/core/JobPosition").IJobPosition & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteJobPosition(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobPosition").IJobPosition, {}, {}> & import("../../models/core/JobPosition").IJobPosition & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getJobApplications(options: {
        page: number;
        limit: number;
        jobPositionId?: string;
        status?: string;
        search?: string;
    }): Promise<{
        applications: (import("mongoose").Document<unknown, {}, import("../../models/core/JobApplication").IJobApplication, {}, {}> & import("../../models/core/JobApplication").IJobApplication & Required<{
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
    getJobApplicationById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobApplication").IJobApplication, {}, {}> & import("../../models/core/JobApplication").IJobApplication & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateJobApplicationStatus(id: string, data: {
        status: string;
        notes?: string;
        interviewDate?: Date;
        interviewNotes?: string;
        rating?: number;
    }): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobApplication").IJobApplication, {}, {}> & import("../../models/core/JobApplication").IJobApplication & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCareersStatistics(): Promise<{
        totalPositions: number;
        activePositions: number;
        totalApplications: number;
        applicationsByStatus: any[];
        positionsByDepartment: any[];
    }>;
    submitJobApplication(data: any, ipAddress?: string, userAgent?: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/JobApplication").IJobApplication, {}, {}> & import("../../models/core/JobApplication").IJobApplication & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=careersService.d.ts.map