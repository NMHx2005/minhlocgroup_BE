"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("@/controllers/client/projectController");
const router = (0, express_1.Router)();
router.get('/', projectController_1.getProjects);
router.get('/types', projectController_1.getProjectTypes);
router.get('/featured', projectController_1.getFeaturedProjects);
router.get('/search', projectController_1.searchProjects);
router.get('/:id', projectController_1.getProjectById);
router.get('/slug/:slug', projectController_1.getProjectBySlug);
router.get('/:id/floor-plans', projectController_1.getProjectFloorPlans);
exports.default = router;
//# sourceMappingURL=projects.js.map