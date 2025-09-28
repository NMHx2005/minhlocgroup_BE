"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessFieldService = void 0;
const core_1 = require("@/models/core");
exports.businessFieldService = {
    async getBusinessFields(options) {
        try {
            const { search, isFeatured } = options;
            const filter = { isActive: true };
            if (isFeatured)
                filter.isFeatured = true;
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            const fields = await core_1.BusinessField.find(filter)
                .sort({ sortOrder: 1, createdAt: -1 });
            return fields;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async getBusinessFieldBySlug(slug) {
        try {
            const field = await core_1.BusinessField.findBySlug(slug);
            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            return field;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
//# sourceMappingURL=businessFieldService.js.map