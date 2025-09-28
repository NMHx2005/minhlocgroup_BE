"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessFieldService = void 0;
const core_1 = require("@/models/core");
const mongoose_1 = require("mongoose");
exports.businessFieldService = {
    async getBusinessFields(options) {
        try {
            const { page, limit, search, isActive, isFeatured } = options;
            const skip = (page - 1) * limit;
            const filter = {};
            if (isActive !== undefined)
                filter.isActive = isActive;
            if (isFeatured !== undefined)
                filter.isFeatured = isFeatured;
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            const fields = await core_1.BusinessField.find(filter)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort({ sortOrder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await core_1.BusinessField.countDocuments(filter);
            return {
                fields,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async getBusinessFieldById(id) {
        try {
            const field = await core_1.BusinessField.findById(id)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email');
            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            return field;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async createBusinessField(data, userId) {
        try {
            const field = new core_1.BusinessField({
                ...data,
                createdBy: new mongoose_1.Types.ObjectId(userId),
                updatedBy: new mongoose_1.Types.ObjectId(userId)
            });
            await field.save();
            return field;
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async updateBusinessField(id, data, userId) {
        try {
            const field = await core_1.BusinessField.findByIdAndUpdate(id, {
                ...data,
                updatedBy: new mongoose_1.Types.ObjectId(userId)
            }, { new: true });
            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            return field;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async deleteBusinessField(id) {
        try {
            const field = await core_1.BusinessField.findByIdAndDelete(id);
            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            return field;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async updateBusinessFieldSortOrder(fields) {
        try {
            const updatePromises = fields.map(field => core_1.BusinessField.findByIdAndUpdate(field.id, { sortOrder: field.sortOrder }));
            await Promise.all(updatePromises);
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật thứ tự: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async toggleBusinessFieldStatus(id) {
        try {
            const field = await core_1.BusinessField.findById(id);
            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            field.isActive = !field.isActive;
            await field.save();
            return field;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
//# sourceMappingURL=businessFieldService.js.map