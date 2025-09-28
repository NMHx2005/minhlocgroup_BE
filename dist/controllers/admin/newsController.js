"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNewsTag = exports.updateNewsTag = exports.createNewsTag = exports.getNewsTags = exports.deleteNewsCategory = exports.updateNewsCategory = exports.createNewsCategory = exports.getNewsCategories = exports.publishNews = exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsById = exports.getNews = void 0;
const newsService_1 = require("@/services/admin/newsService");
const getNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, status, author } = req.query;
        const filters = {
            search: search,
            category: category,
            status: status,
            author: author
        };
        const result = await newsService_1.newsService.getNews(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.articles,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tin tức',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getNews = getNews;
const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await newsService_1.newsService.getNewsById(id);
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
            return;
        }
        res.json({
            success: true,
            data: article
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getNewsById = getNewsById;
const createNews = async (req, res) => {
    try {
        const articleData = {
            ...req.body,
            author: {
                id: req.user?.id,
                name: req.user?.name
            }
        };
        const article = await newsService_1.newsService.createNews(articleData);
        res.status(201).json({
            success: true,
            message: 'Tạo bài viết thành công',
            data: article
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createNews = createNews;
const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            author: {
                id: req.user?.id,
                name: req.user?.name
            }
        };
        const article = await newsService_1.newsService.updateNews(id, updateData);
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật bài viết thành công',
            data: article
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateNews = updateNews;
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await newsService_1.newsService.deleteNews(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Xóa bài viết thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteNews = deleteNews;
const publishNews = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await newsService_1.newsService.publishNews(id);
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Xuất bản bài viết thành công',
            data: article
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xuất bản bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.publishNews = publishNews;
const getNewsCategories = async (req, res) => {
    try {
        const categories = await newsService_1.newsService.getNewsCategories();
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getNewsCategories = getNewsCategories;
const createNewsCategory = async (req, res) => {
    try {
        const category = await newsService_1.newsService.createNewsCategory(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo chuyên mục thành công',
            data: category
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createNewsCategory = createNewsCategory;
const updateNewsCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await newsService_1.newsService.updateNewsCategory(id, req.body);
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy chuyên mục'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật chuyên mục thành công',
            data: category
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateNewsCategory = updateNewsCategory;
const deleteNewsCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await newsService_1.newsService.deleteNewsCategory(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy chuyên mục'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Xóa chuyên mục thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteNewsCategory = deleteNewsCategory;
const getNewsTags = async (req, res) => {
    try {
        const tags = await newsService_1.newsService.getNewsTags();
        res.json({
            success: true,
            data: tags
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tag',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getNewsTags = getNewsTags;
const createNewsTag = async (req, res) => {
    try {
        const tag = await newsService_1.newsService.createNewsTag(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo tag thành công',
            data: tag
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo tag',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createNewsTag = createNewsTag;
const updateNewsTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await newsService_1.newsService.updateNewsTag(id, req.body);
        if (!tag) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy tag'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật tag thành công',
            data: tag
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật tag',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateNewsTag = updateNewsTag;
const deleteNewsTag = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await newsService_1.newsService.deleteNewsTag(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy tag'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Xóa tag thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa tag',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteNewsTag = deleteNewsTag;
//# sourceMappingURL=newsController.js.map