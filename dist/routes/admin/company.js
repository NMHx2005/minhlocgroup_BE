"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("@/controllers/admin/companyController");
const auth_1 = require("@/middleware/auth");
const admin_1 = require("@/middleware/admin");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.use(admin_1.adminMiddleware);
router.get('/info', companyController_1.getCompanyInfo);
router.post('/info', companyController_1.createOrUpdateCompanyInfo);
router.delete('/info/:id', companyController_1.deleteCompanyInfo);
router.put('/info/sort', companyController_1.updateCompanyInfoSortOrder);
exports.default = router;
//# sourceMappingURL=company.js.map