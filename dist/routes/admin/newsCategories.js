"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsCategoryController_1 = require("../../controllers/admin/newsCategoryController");
const auth_1 = require("../../middleware/auth");
const admin_1 = require("../../middleware/admin");
const validation_1 = require("../../middleware/validation");
const router = express_1.default.Router();
router.use(auth_1.authMiddleware);
router.use(admin_1.adminMiddleware);
router.get('/', newsCategoryController_1.getNewsCategories);
router.get('/active', newsCategoryController_1.getActiveNewsCategories);
router.get('/stats', newsCategoryController_1.getCategoryStats);
router.get('/:id', newsCategoryController_1.getNewsCategoryById);
router.post('/', validation_1.validateCreateNewsCategory, newsCategoryController_1.createNewsCategory);
router.put('/:id', validation_1.validateNewsCategory, newsCategoryController_1.updateNewsCategory);
router.patch('/:id/toggle-status', newsCategoryController_1.toggleCategoryStatus);
router.put('/sort-order', newsCategoryController_1.updateSortOrder);
router.delete('/:id', newsCategoryController_1.deleteNewsCategory);
exports.default = router;
//# sourceMappingURL=newsCategories.js.map