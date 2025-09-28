"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = void 0;
const core_1 = require("@/models/core");
const mongoose_1 = require("mongoose");
exports.companyService = {
    async getCompanyInfo(section) {
        try {
            if (section) {
                return await core_1.CompanyInfo.findBySection(section);
            }
            return await core_1.CompanyInfo.findActiveSections();
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin công ty: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async createOrUpdateCompanyInfo(data, userId) {
        try {
            const { section, title, content, images, data: sectionData, sortOrder } = data;
            let companyInfo = await core_1.CompanyInfo.findOne({ section });
            if (companyInfo) {
                companyInfo.title = title;
                companyInfo.content = content;
                companyInfo.images = images || [];
                companyInfo.data = sectionData || {};
                companyInfo.sortOrder = sortOrder || 0;
                companyInfo.updatedBy = new mongoose_1.Types.ObjectId(userId);
                await companyInfo.save();
            }
            else {
                companyInfo = new core_1.CompanyInfo({
                    section,
                    title,
                    content,
                    images: images || [],
                    data: sectionData || {},
                    sortOrder: sortOrder || 0,
                    createdBy: new mongoose_1.Types.ObjectId(userId),
                    updatedBy: new mongoose_1.Types.ObjectId(userId)
                });
                await companyInfo.save();
            }
            return companyInfo;
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo/cập nhật thông tin công ty: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async deleteCompanyInfo(id) {
        try {
            const companyInfo = await core_1.CompanyInfo.findByIdAndDelete(id);
            if (!companyInfo) {
                throw new Error('Không tìm thấy thông tin công ty');
            }
            return companyInfo;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa thông tin công ty: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async updateCompanyInfoSortOrder(sections) {
        try {
            const updatePromises = sections.map(section => core_1.CompanyInfo.findByIdAndUpdate(section.id, { sortOrder: section.sortOrder }));
            await Promise.all(updatePromises);
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật thứ tự: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
