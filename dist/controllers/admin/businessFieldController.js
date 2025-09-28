"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBusinessFieldStatus = exports.updateBusinessFieldSortOrder = exports.deleteBusinessField = exports.updateBusinessField = exports.createBusinessField = exports.getBusinessFieldById = exports.getBusinessFields = void 0;
const businessFieldService_1 = require("@/services/admin/businessFieldService");
const getBusinessFields = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, isActive, isFeatured } = req.query;
        const fields = await businessFieldService_1.businessFieldService.getBusinessFields({
            page: Number(page),
            limit: Number(limit),
            ...(search && { search: search }),
            ...(isActive !== undefined && { isActive: isActive === 'true' }),
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
        return;
    }
};
exports.getBusinessFields = getBusinessFields;
const getBusinessFieldById = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await businessFieldService_1.businessFieldService.getBusinessFieldById(id);
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
        return;
    }
};
exports.getBusinessFieldById = getBusinessFieldById;
const createBusinessField = async (req, res) => {
    try {
        const field = await businessFieldService_1.businessFieldService.createBusinessField(req.body, req.user?.id);
        res.json({
            success: true,
            data: field,
            message: 'Tạo lĩnh vực hoạt động thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createBusinessField = createBusinessField;
const updateBusinessField = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await businessFieldService_1.businessFieldService.updateBusinessField(id, req.body, req.user?.id);
        res.json({
            success: true,
            data: field,
            message: 'Cập nhật lĩnh vực hoạt động thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateBusinessField = updateBusinessField;
const deleteBusinessField = async (req, res) => {
    try {
        const { id } = req.params;
        await businessFieldService_1.businessFieldService.deleteBusinessField(id);
        res.json({
            success: true,
            message: 'Xóa lĩnh vực hoạt động thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteBusinessField = deleteBusinessField;
const updateBusinessFieldSortOrder = async (req, res) => {
    try {
        const { fields } = req.body;
        await businessFieldService_1.businessFieldService.updateBusinessFieldSortOrder(fields);
        res.json({
            success: true,
            message: 'Cập nhật thứ tự thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thứ tự',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateBusinessFieldSortOrder = updateBusinessFieldSortOrder;
const toggleBusinessFieldStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await businessFieldService_1.businessFieldService.toggleBusinessFieldStatus(id);
        res.json({
            success: true,
            data: field,
            message: 'Cập nhật trạng thái thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.toggleBusinessFieldStatus = toggleBusinessFieldStatus;
