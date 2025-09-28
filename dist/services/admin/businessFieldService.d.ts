export declare const businessFieldService: {
    getBusinessFields(options: {
        page: number;
        limit: number;
        search?: string;
        isActive?: boolean;
        isFeatured?: boolean;
    }): Promise<{
        fields: (import("mongoose").Document<unknown, {}, import("../../models/core/BusinessField").IBusinessField, {}, {}> & import("../../models/core/BusinessField").IBusinessField & Required<{
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
    getBusinessFieldById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/BusinessField").IBusinessField, {}, {}> & import("../../models/core/BusinessField").IBusinessField & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createBusinessField(data: any, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/BusinessField").IBusinessField, {}, {}> & import("../../models/core/BusinessField").IBusinessField & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateBusinessField(id: string, data: any, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/BusinessField").IBusinessField, {}, {}> & import("../../models/core/BusinessField").IBusinessField & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteBusinessField(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/BusinessField").IBusinessField, {}, {}> & import("../../models/core/BusinessField").IBusinessField & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateBusinessFieldSortOrder(fields: Array<{
        id: string;
        sortOrder: number;
    }>): Promise<void>;
    toggleBusinessFieldStatus(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/BusinessField").IBusinessField, {}, {}> & import("../../models/core/BusinessField").IBusinessField & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=businessFieldService.d.ts.map