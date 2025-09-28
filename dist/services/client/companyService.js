"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = void 0;
const core_1 = require("@/models/core");
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
    }
};
//# sourceMappingURL=companyService.js.map