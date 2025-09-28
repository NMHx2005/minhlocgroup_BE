import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { newsService } from '../../services/client/newsService';

/**
 * Get all published news articles for client
 * GET /api/v1/client/news
 */
export const getNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, category, tag } = req.query;

        const filters = {
            search: search as string,
            category: category as string,
            tag: tag as string
        };

        const result = await newsService.getNews(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.articles,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tin tức',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get news article by ID for client
 * GET /api/v1/client/news/:id
 */
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const article = await newsService.getNewsById(id as string);

        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });;

            return;
        }

        // Increment view count
        await newsService.incrementViewCount(id as string);

        res.json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get news article by slug for client
 * GET /api/v1/client/news/slug/:slug
 */
export const getNewsBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const article = await newsService.getNewsBySlug(slug as string);

        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });;

            return;
        }

        // Increment view count
        await newsService.incrementViewCount(article._id);

        res.json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get featured news articles
 * GET /api/v1/client/news/featured
 */
export const getFeaturedNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { limit = 5 } = req.query;
        const articles = await newsService.getFeaturedNews(parseInt(limit as string));

        res.json({
            success: true,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tin tức nổi bật',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get latest news articles
 * GET /api/v1/client/news/latest
 */
export const getLatestNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { limit = 10 } = req.query;
        const articles = await newsService.getLatestNews(parseInt(limit as string));

        res.json({
            success: true,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tin tức mới nhất',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get news by category
 * GET /api/v1/client/news/category/:categoryId
 */
export const getNewsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await newsService.getNewsByCategory(
            categoryId as string,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.json({
            success: true,
            data: result.articles,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tin tức theo chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Search news articles
 * GET /api/v1/client/news/search
 */
export const searchNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, category, tag, dateFrom, dateTo } = req.query;

        const searchParams = {
            query: q as string,
            category: category as string,
            tag: tag as string,
            dateFrom: dateFrom as string,
            dateTo: dateTo as string
        };

        const articles = await newsService.searchNews(searchParams as any);

        res.json({
            success: true,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm tin tức',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get news categories
 * GET /api/v1/client/news-categories
 */
export const getNewsCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await newsService.getNewsCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get news tags
 * GET /api/v1/client/news-tags
 */
export const getNewsTags = async (req: Request, res: Response): Promise<void> => {
    try {
        const tags = await newsService.getNewsTags();
        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tag',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get related news articles
 * GET /api/v1/client/news/:id/related
 */
export const getRelatedNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { limit = 5 } = req.query;

        const articles = await newsService.getRelatedNews(id as string, parseInt(limit as string));

        res.json({
            success: true,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tin tức liên quan',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};
