import { NewsArticle, NewsCategory } from '@/models/core';

export interface NewsFilters {
    search?: string;
    category?: string;
    tag?: string;
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

export interface NewsSearchParams {
    query?: string;
    category?: string;
    tag?: string;
    dateFrom?: string;
    dateTo?: string;
}

class NewsService {
    /**
     * Get all published news articles for client
     */
    async getNews(page: number, limit: number, filters: NewsFilters): Promise<NewsListResult> {
        try {
            const query: any = {
                status: 'published'
            };

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

            if (filters.tag) {
                query.tags = { $in: [new RegExp(filters.tag, 'i')] };
            }

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await NewsArticle.countDocuments(query);

            // Get articles with pagination
            const articles = await NewsArticle.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách tin tức: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get news article by ID for client
     */
    async getNewsById(id: string): Promise<any> {
        try {
            const article = await NewsArticle.findOne({
                _id: id,
                status: 'published'
            })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .lean();

            return article;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get news article by slug for client
     */
    async getNewsBySlug(slug: string): Promise<any> {
        try {
            const article = await NewsArticle.findOne({
                slug,
                status: 'published'
            })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .lean();

            return article;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin bài viết: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get featured news articles
     */
    async getFeaturedNews(limit: number = 5): Promise<any[]> {
        try {
            const articles = await NewsArticle.find({
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy tin tức nổi bật: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get latest news articles
     */
    async getLatestNews(limit: number = 10): Promise<any[]> {
        try {
            const articles = await NewsArticle.find({
                status: 'published'
            })
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ publishedAt: -1 })
                .limit(limit)
                .lean();

            return articles;
        } catch (error) {
            throw new Error(`Lỗi khi lấy tin tức mới nhất: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get news by category
     */
    async getNewsByCategory(categoryId: string, page: number, limit: number): Promise<NewsListResult> {
        try {
            const query = {
                categoryId,
                status: 'published'
            };

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await NewsArticle.countDocuments(query);

            // Get articles with pagination
            const articles = await NewsArticle.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy tin tức theo chuyên mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Search news articles
     */
    async searchNews(searchParams: NewsSearchParams): Promise<any[]> {
        try {
            const query: any = {
                status: 'published'
            };

            // Apply search filters
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

            const articles = await NewsArticle.find(query)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ isBreaking: -1, publishedAt: -1 })
                .lean();

            return articles;
        } catch (error) {
            throw new Error(`Lỗi khi tìm kiếm tin tức: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
     * Get related news articles
     */
    async getRelatedNews(articleId: string, limit: number = 5): Promise<any[]> {
        try {
            const article = await NewsArticle.findById(articleId).select('categoryId tags');
            if (!article) {
                return [];
            }

            const query: any = {
                _id: { $ne: articleId },
                status: 'published'
            };

            // Find related articles by category or tags
            if (article.categoryId) {
                query.categoryId = article.categoryId;
            }

            if (article.tags && article.tags.length > 0) {
                query.tags = { $in: article.tags };
            }

            const relatedArticles = await NewsArticle.find(query)
                .populate('categoryId', 'name slug color')
                .populate('author.id', 'name email')
                .select('-__v')
                .sort({ publishedAt: -1 })
                .limit(limit)
                .lean();

            return relatedArticles;
        } catch (error) {
            throw new Error(`Lỗi khi lấy tin tức liên quan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Increment view count
     */
    async incrementViewCount(articleId: string): Promise<void> {
        try {
            await NewsArticle.findByIdAndUpdate(
                articleId,
                { $inc: { 'statistics.views': 1 } },
                { new: true }
            );
        } catch (error) {
            // Don't throw error for view count increment
            console.error('Error incrementing view count:', error);
        }
    }
}

export const newsService = new NewsService();
