"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsService = void 0;
const core_1 = require("@/models/core");
class NewsService {
    async getNews(page, limit, filters) {
        try {
            const query = {};
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
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.author) {
                query['author.id'] = filters.author;
            }
            const skip = (page - 1) * limit;
            const total = await core_1.NewsArticle.countDocuments(query);
            const articles = await core_1.NewsArticle.find(query)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .sort({ createdAt: -1 })
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
            const article = await core_1.NewsArticle.findById(id)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .lean();
            return article;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createNews(articleData) {
        try {
            const article = new core_1.NewsArticle(articleData);
            await article.save();
            return await core_1.NewsArticle.findById(article._id)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateNews(id, updateData) {
        try {
            const article = await core_1.NewsArticle.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .lean();
            return article;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteNews(id) {
        try {
            const result = await core_1.NewsArticle.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async publishNews(id) {
        try {
            const article = await core_1.NewsArticle.findByIdAndUpdate(id, {
                status: 'published',
                publishedAt: new Date(),
                updatedAt: new Date()
            }, { new: true, runValidators: true })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .lean();
            return article;
        }
        catch (error) {
            throw new Error(`Lỗi khi xuất bản bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    async createNewsCategory(categoryData) {
        try {
            const category = new core_1.NewsCategory(categoryData);
            await category.save();
            return category;
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateNewsCategory(id, updateData) {
        try {
            const category = await core_1.NewsCategory.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
            return category;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteNewsCategory(id) {
        try {
            const articleCount = await core_1.NewsArticle.countDocuments({ categoryId: id });
            if (articleCount > 0) {
                throw new Error('Không thể xóa chuyên mục có bài viết');
            }
            const result = await core_1.NewsCategory.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    async createNewsTag(tagData) {
        try {
            return { name: tagData.name, slug: tagData.name.toLowerCase() };
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateNewsTag(id, updateData) {
        try {
            return { name: updateData.name, slug: updateData.name.toLowerCase() };
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteNewsTag(id) {
        try {
            return true;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.newsService = new NewsService();
