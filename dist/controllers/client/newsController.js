"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedNews = exports.getNewsTags = exports.getNewsCategories = exports.searchNews = exports.getNewsByCategory = exports.getLatestNews = exports.getFeaturedNews = exports.getNewsBySlug = exports.getNewsById = exports.getNews = void 0;
const newsService_1 = require("@/services/client/newsService");
const getNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, tag } = req.query;
        const filters = {
            search: search,
            category: category,
            tag: tag
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
        ;
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
            ;
            return;
        }
        await newsService_1.newsService.incrementViewCount(id);
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
        ;
        return;
    }
};
exports.getNewsById = getNewsById;
const getNewsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const article = await newsService_1.newsService.getNewsBySlug(slug);
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
            ;
            return;
        }
        await newsService_1.newsService.incrementViewCount(article._id);
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
        ;
        return;
    }
};
exports.getNewsBySlug = getNewsBySlug;
const getFeaturedNews = async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const articles = await newsService_1.newsService.getFeaturedNews(parseInt(limit));
        res.json({
            success: true,
            data: articles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tin tức nổi bật',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getFeaturedNews = getFeaturedNews;
const getLatestNews = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const articles = await newsService_1.newsService.getLatestNews(parseInt(limit));
        res.json({
            success: true,
            data: articles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tin tức mới nhất',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getLatestNews = getLatestNews;
const getNewsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const result = await newsService_1.newsService.getNewsByCategory(categoryId, parseInt(page), parseInt(limit));
        res.json({
            success: true,
            data: result.articles,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tin tức theo chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getNewsByCategory = getNewsByCategory;
const searchNews = async (req, res) => {
    try {
        const { q, category, tag, dateFrom, dateTo } = req.query;
        const searchParams = {
            query: q,
            category: category,
            tag: tag,
            dateFrom: dateFrom,
            dateTo: dateTo
        };
        const articles = await newsService_1.newsService.searchNews(searchParams);
        res.json({
            success: true,
            data: articles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm tin tức',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.searchNews = searchNews;
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
        ;
        return;
    }
};
exports.getNewsCategories = getNewsCategories;
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
        ;
        return;
    }
};
exports.getNewsTags = getNewsTags;
const getRelatedNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 5 } = req.query;
        const articles = await newsService_1.newsService.getRelatedNews(id, parseInt(limit));
        res.json({
            success: true,
            data: articles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tin tức liên quan',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getRelatedNews = getRelatedNews;
