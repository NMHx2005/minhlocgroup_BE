"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinessFieldBySlug = exports.getBusinessFields = void 0;
const businessFieldService_1 = require("@/services/client/businessFieldService");
const getBusinessFields = async (req, res) => {
    try {
        const { search, isFeatured } = req.query;
        const fields = await businessFieldService_1.businessFieldService.getBusinessFields({
            ...(search && { search: search }),
            ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' })
        });
        res.json({
            success: true,
            data: fields
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getBusinessFields = getBusinessFields;
const getBusinessFieldBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const field = await businessFieldService_1.businessFieldService.getBusinessFieldBySlug(slug);
        res.json({
            success: true,
            data: field
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getBusinessFieldBySlug = getBusinessFieldBySlug;
//# sourceMappingURL=businessFieldController.js.map