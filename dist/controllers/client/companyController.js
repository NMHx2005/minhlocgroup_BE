"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyInfo = void 0;
const companyService_1 = require("@/services/client/companyService");
const getCompanyInfo = async (req, res) => {
    try {
        const { section } = req.query;
        const companyInfo = await companyService_1.companyService.getCompanyInfo(section);
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
    }
};
exports.getCompanyInfo = getCompanyInfo;
