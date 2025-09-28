"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("@/controllers/client/companyController");
const router = (0, express_1.Router)();
router.get('/info', companyController_1.getCompanyInfo);
exports.default = router;
