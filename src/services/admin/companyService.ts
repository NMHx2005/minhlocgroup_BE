import { CompanyInfo } from '../../models/core';
import { Types } from 'mongoose';

export const companyService = {
    /**
     * Get company info by section or all sections
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
    },

    /**
     * Create or update company info section
     */
    async createOrUpdateCompanyInfo(data: any, userId: string) {
        try {
            const { section, title, content, images, data: sectionData, sortOrder } = data;

            // Check if section already exists
            let companyInfo = await CompanyInfo.findOne({ section });

            if (companyInfo) {
                // Update existing section
                companyInfo.title = title;
                companyInfo.content = content;
                companyInfo.images = images || [];
                companyInfo.data = sectionData || {};
                companyInfo.sortOrder = sortOrder || 0;
                companyInfo.updatedBy = new Types.ObjectId(userId);
                await companyInfo.save();
            } else {
                // Create new section
                companyInfo = new CompanyInfo({
                    section,
                    title,
                    content,
                    images: images || [],
                    data: sectionData || {},
                    sortOrder: sortOrder || 0,
                    createdBy: new Types.ObjectId(userId),
                    updatedBy: new Types.ObjectId(userId)
                });
                await companyInfo.save();
            }

            return companyInfo;
        } catch (error) {
            throw new Error(`Lỗi khi tạo/cập nhật thông tin công ty: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Delete company info section
     */
    async deleteCompanyInfo(id: string) {
        try {
            const companyInfo = await CompanyInfo.findByIdAndDelete(id);
            if (!companyInfo) {
                throw new Error('Không tìm thấy thông tin công ty');
            }
            return companyInfo;
        } catch (error) {
            throw new Error(`Lỗi khi xóa thông tin công ty: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Update company info sort order
     */
    async updateCompanyInfoSortOrder(sections: Array<{ id: string; sortOrder: number }>) {
        try {
            const updatePromises = sections.map(section =>
                CompanyInfo.findByIdAndUpdate(section.id, { sortOrder: section.sortOrder })
            );
            await Promise.all(updatePromises);
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật thứ tự: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
