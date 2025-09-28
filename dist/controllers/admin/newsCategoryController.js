"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSortOrder = exports.toggleCategoryStatus = exports.getCategoryStats = exports.deleteNewsCategory = exports.updateNewsCategory = exports.createNewsCategory = exports.getNewsCategoryById = exports.getActiveNewsCategories = exports.getNewsCategories = void 0;
const newsCategoryService_1 = __importDefault(require("../../services/admin/newsCategoryService"));
const getNewsCategories = async (req, res) => {
    try {
        const categories = await newsCategoryService_1.default.getCategories();
        res.json({
            success: true,
            message: 'Lấy danh sách danh mục thành công',
            data: categories
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getNewsCategories = getNewsCategories;
const getActiveNewsCategories = async (req, res) => {
    try {
        const categories = await newsCategoryService_1.default.getActiveCategories();
        res.json({
            success: true,
            message: 'Lấy danh sách danh mục hoạt động thành công',
            data: categories
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách danh mục hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getActiveNewsCategories = getActiveNewsCategories;
const getNewsCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID danh mục là bắt buộc'
            });
            return;
        }
        const category = await newsCategoryService_1.default.getCategoryById(id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Lấy thông tin danh mục thành công',
            data: category
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getNewsCategoryById = getNewsCategoryById;
const createNewsCategory = async (req, res) => {
    try {
        const category = await newsCategoryService_1.default.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo danh mục thành công',
            data: category
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createNewsCategory = createNewsCategory;
const updateNewsCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID danh mục là bắt buộc'
            });
            return;
        }
        const category = await newsCategoryService_1.default.updateCategory(id, req.body);
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật danh mục thành công',
            data: category
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateNewsCategory = updateNewsCategory;
const deleteNewsCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID danh mục là bắt buộc'
            });
            return;
        }
        const deleted = await newsCategoryService_1.default.deleteCategory(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteNewsCategory = deleteNewsCategory;
const getCategoryStats = async (req, res) => {
    try {
        const stats = await newsCategoryService_1.default.getCategoryStats();
        res.json({
            success: true,
            message: 'Lấy thống kê danh mục thành công',
            data: stats
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getCategoryStats = getCategoryStats;
const toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID danh mục là bắt buộc'
            });
            return;
        }
        const category = await newsCategoryService_1.default.toggleCategoryStatus(id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Thay đổi trạng thái danh mục thành công',
            data: category
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi thay đổi trạng thái danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.toggleCategoryStatus = toggleCategoryStatus;
const updateSortOrder = async (req, res) => {
    try {
        const { categories } = req.body;
        if (!Array.isArray(categories)) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu thứ tự sắp xếp không hợp lệ'
            });
            return;
        }
        await newsCategoryService_1.default.updateSortOrder(categories);
        res.json({
            success: true,
            message: 'Cập nhật thứ tự sắp xếp thành công'
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật thứ tự sắp xếp',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateSortOrder = updateSortOrder;
