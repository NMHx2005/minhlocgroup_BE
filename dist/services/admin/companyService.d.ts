export declare const companyService: {
    getCompanyInfo(section?: string): Promise<import("../../models/core/CompanyInfo").ICompanyInfo | import("../../models/core/CompanyInfo").ICompanyInfo[] | null>;
    createOrUpdateCompanyInfo(data: any, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/CompanyInfo").ICompanyInfo, {}, {}> & import("../../models/core/CompanyInfo").ICompanyInfo & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteCompanyInfo(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/core/CompanyInfo").ICompanyInfo, {}, {}> & import("../../models/core/CompanyInfo").ICompanyInfo & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCompanyInfoSortOrder(sections: Array<{
        id: string;
        sortOrder: number;
    }>): Promise<void>;
};
//# sourceMappingURL=companyService.d.ts.map