import { CompanyInfo } from '@/models/core';

export const companyService = {
    /**
     * Get company info for public display
     */
    async getCompanyInfo(section?: string) {
        try {
            if (section) {
                return await CompanyInfo.findBySection(section);
            }
            return await CompanyInfo.findActiveSections();
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin công ty: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
