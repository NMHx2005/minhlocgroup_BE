import { NewsArticle, NewsCategory } from '@/models/core';

export interface NewsFilters {
    search?: string;
    category?: string;
    status?: string;
    author?: string;
}

export interface NewsListResult {
    articles: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

class NewsService {
    /**
     * Get all news articles with pagination and filters
     */
    async getNews(page: number, limit: number, filters: NewsFilters): Promise<NewsListResult> {
        try {
            const query: any = {};

            // Apply filters
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

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await NewsArticle.countDocuments(query);

            // Get articles with pagination
            const articles = await NewsArticle.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách tin tức: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get news article by ID
     */
    async getNewsById(id: string): Promise<any> {
        try {
            const article = await NewsArticle.findById(id)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .lean();

            return article;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create new news article
     */
    async createNews(articleData: any): Promise<any> {
        try {
            const article = new NewsArticle(articleData);
            await article.save();

            return await NewsArticle.findById(article._id)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update news article
     */
    async updateNews(id: string, updateData: any): Promise<any> {
        try {
            const article = await NewsArticle.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .lean();

            return article;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete news article
     */
    async deleteNews(id: string): Promise<boolean> {
        try {
            const result = await NewsArticle.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Publish news article
     */
    async publishNews(id: string): Promise<any> {
        try {
            const article = await NewsArticle.findByIdAndUpdate(
                id,
                {
                    status: 'published',
                    publishedAt: new Date(),
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            )
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .lean();

            return article;
        } catch (error) {
            throw new Error(`Lỗi khi xuất bản bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get news categories
     */
    async getNewsCategories(): Promise<any[]> {
        try {
            const categories = await NewsCategory.find({ isActive: true })
                .sort({ name: 1 })
                .lean();

            return categories;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create news category
     */
    async createNewsCategory(categoryData: any): Promise<any> {
        try {
            const category = new NewsCategory(categoryData);
            await category.save();

            return category;
        } catch (error) {
            throw new Error(`Lỗi khi tạo chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update news category
     */
    async updateNewsCategory(id: string, updateData: any): Promise<any> {
        try {
            const category = await NewsCategory.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).lean();

            return category;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete news category
     */
    async deleteNewsCategory(id: string): Promise<boolean> {
        try {
            // Check if category has articles
            const articleCount = await NewsArticle.countDocuments({ categoryId: id });
            if (articleCount > 0) {
                throw new Error('Không thể xóa chuyên mục có bài viết');
            }

            const result = await NewsCategory.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get news tags
     */
    async getNewsTags(): Promise<string[]> {
        try {
            const articles = await NewsArticle.find({ status: 'published' })
                .select('tags')
                .lean();

            const allTags = articles.flatMap(article => article.tags || []);
            const uniqueTags = [...new Set(allTags)];

            return uniqueTags.sort();
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create news tag
     */
    async createNewsTag(tagData: any): Promise<any> {
        try {
            // Tags are stored as strings in articles, not as separate documents
            // This method could be used to manage tag metadata or validation
            return { name: tagData.name, slug: tagData.name.toLowerCase() };
        } catch (error) {
            throw new Error(`Lỗi khi tạo tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update news tag
     */
    async updateNewsTag(id: string, updateData: any): Promise<any> {
        try {
            // Tags are stored as strings in articles, not as separate documents
            // This method could be used to update tag references across articles
            return { name: updateData.name, slug: updateData.name.toLowerCase() };
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete news tag
     */
    async deleteNewsTag(id: string): Promise<boolean> {
        try {
            // Tags are stored as strings in articles, not as separate documents
            // This method could be used to remove tag references from articles
            return true;
        } catch (error) {
            throw new Error(`Lỗi khi xóa tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const newsService = new NewsService();
