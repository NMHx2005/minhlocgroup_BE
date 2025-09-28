"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsService = void 0;
const core_1 = require("@/models/core");
class NewsService {
    async getNews(page, limit, filters) {
        try {
            const query = {
                status: 'published'
            };
            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { excerpt: { $regex: filters.search, $options: 'i' } },
                    { content: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.category) {
                query.categoryId = filters.category;
            }
            if (filters.tag) {
                query.tags = { $in: [new RegExp(filters.tag, 'i')] };
            }
            const skip = (page - 1) * limit;
            const total = await core_1.NewsArticle.countDocuments(query);
            const articles = await core_1.NewsArticle.find(query)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ isBreaking: -1, publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                articles,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách tin tức: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getNewsById(id) {
        try {
            const article = await core_1.NewsArticle.findOne({
                _id: id,
                status: 'published'
            })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .lean();
            return article;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getNewsBySlug(slug) {
        try {
            const article = await core_1.NewsArticle.findOne({
                slug,
                status: 'published'
            })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .lean();
            return article;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getFeaturedNews(limit = 5) {
        try {
            const articles = await core_1.NewsArticle.find({
                status: 'published',
                isFeatured: true
            })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ publishedAt: -1 })
                .limit(limit)
                .lean();
            return articles;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy tin tức nổi bật: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getLatestNews(limit = 10) {
        try {
            const articles = await core_1.NewsArticle.find({
                status: 'published'
            })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ publishedAt: -1 })
                .limit(limit)
                .lean();
            return articles;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy tin tức mới nhất: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getNewsByCategory(categoryId, page, limit) {
        try {
            const query = {
                categoryId,
                status: 'published'
            };
            const skip = (page - 1) * limit;
            const total = await core_1.NewsArticle.countDocuments(query);
            const articles = await core_1.NewsArticle.find(query)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ isBreaking: -1, publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                articles,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy tin tức theo chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async searchNews(searchParams) {
        try {
            const query = {
                status: 'published'
            };
            if (searchParams.query) {
                query.$or = [
                    { title: { $regex: searchParams.query, $options: 'i' } },
                    { excerpt: { $regex: searchParams.query, $options: 'i' } },
                    { content: { $regex: searchParams.query, $options: 'i' } },
                    { tags: { $in: [new RegExp(searchParams.query, 'i')] } }
                ];
            }
            if (searchParams.category) {
                query.categoryId = searchParams.category;
            }
            if (searchParams.tag) {
                query.tags = { $in: [new RegExp(searchParams.tag, 'i')] };
            }
            if (searchParams.dateFrom || searchParams.dateTo) {
                query.publishedAt = {};
                if (searchParams.dateFrom) {
                    query.publishedAt.$gte = new Date(searchParams.dateFrom);
                }
                if (searchParams.dateTo) {
                    query.publishedAt.$lte = new Date(searchParams.dateTo);
                }
            }
            const articles = await core_1.NewsArticle.find(query)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ isBreaking: -1, publishedAt: -1 })
                .lean();
            return articles;
        }
        catch (error) {
            throw new Error(`Lỗi khi tìm kiếm tin tức: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getNewsCategories() {
        try {
            const categories = await core_1.NewsCategory.find({ isActive: true })
                .sort({ name: 1 })
                .lean();
            return categories;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getNewsTags() {
        try {
            const articles = await core_1.NewsArticle.find({ status: 'published' })
                .select('tags')
                .lean();
            const allTags = articles.flatMap(article => article.tags || []);
            const uniqueTags = [...new Set(allTags)];
            return uniqueTags.sort();
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getRelatedNews(articleId, limit = 5) {
        try {
            const article = await core_1.NewsArticle.findById(articleId).select('categoryId tags');
            if (!article) {
                return [];
            }
            const query = {
                _id: { $ne: articleId },
                status: 'published'
            };
            if (article.categoryId) {
                query.categoryId = article.categoryId;
            }
            if (article.tags && article.tags.length > 0) {
                query.tags = { $in: article.tags };
            }
            const relatedArticles = await core_1.NewsArticle.find(query)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ publishedAt: -1 })
                .limit(limit)
                .lean();
            return relatedArticles;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy tin tức liên quan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async incrementViewCount(articleId) {
        try {
            await core_1.NewsArticle.findByIdAndUpdate(articleId, { $inc: { 'statistics.views': 1 } }, { new: true });
        }
        catch (error) {
            console.error('Error incrementing view count:', error);
        }
    }
}
exports.newsService = new NewsService();
//# sourceMappingURL=newsService.js.map