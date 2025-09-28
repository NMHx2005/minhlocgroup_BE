"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessFieldController_1 = require("@/controllers/client/businessFieldController");
const router = (0, express_1.Router)();
router.get('/', businessFieldController_1.getBusinessFields);
router.get('/:slug', businessFieldController_1.getBusinessFieldBySlug);
exports.default = router;
