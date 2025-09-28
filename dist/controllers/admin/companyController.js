"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanyInfoSortOrder = exports.deleteCompanyInfo = exports.createOrUpdateCompanyInfo = exports.getCompanyInfo = void 0;
const companyService_1 = require("@/services/admin/companyService");
const getCompanyInfo = async (req, res) => {
    try {
        const { section } = req.query;
        const companyInfo = await companyService_1.companyService.getCompanyInfo(section ? section : undefined);
        res.json({
            success: true,
            data: companyInfo
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin công ty',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getCompanyInfo = getCompanyInfo;
const createOrUpdateCompanyInfo = async (req, res) => {
    try {
        const companyInfo = await companyService_1.companyService.createOrUpdateCompanyInfo(req.body, req.user?.id);
        res.json({
            success: true,
            data: companyInfo,
            message: 'Cập nhật thông tin công ty thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thông tin công ty',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.createOrUpdateCompanyInfo = createOrUpdateCompanyInfo;
const deleteCompanyInfo = async (req, res) => {
    try {
        const { id } = req.params;
        await companyService_1.companyService.deleteCompanyInfo(id);
        res.json({
            success: true,
            message: 'Xóa thông tin công ty thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa thông tin công ty',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.deleteCompanyInfo = deleteCompanyInfo;
const updateCompanyInfoSortOrder = async (req, res) => {
    try {
        const { sections } = req.body;
        await companyService_1.companyService.updateCompanyInfoSortOrder(sections);
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
        ;
        return;
    }
};
exports.updateCompanyInfoSortOrder = updateCompanyInfoSortOrder;
//# sourceMappingURL=companyController.js.map