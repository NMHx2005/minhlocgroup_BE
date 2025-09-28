export declare const businessFieldService: {
    getBusinessFields(options: {
        search?: string;
        isFeatured?: boolean;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../models/core/BusinessField").IBusinessField, {}, {}> & import("../../models/core/BusinessField").IBusinessField & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getBusinessFieldBySlug(slug: string): Promise<import("../../models/core/BusinessField").IBusinessField>;
};
//# sourceMappingURL=businessFieldService.d.ts.map