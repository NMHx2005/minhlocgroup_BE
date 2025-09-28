import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { newsService } from '../../services/admin/newsService';

/**
 * Get all news articles with pagination and filters
 * GET /api/v1/news
 */
export const getNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, category, status, author } = req.query;

        const filters = {
            search: search as string,
            category: category as string,
            status: status as string,
            author: author as string
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
        });
        return;
    }
};

/**
 * Get news article by ID
 * GET /api/v1/news/:id
 */
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const article = await newsService.getNewsById(id as string);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Create new news article
 * POST /api/v1/news
 */
export const createNews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const articleData = {
            ...req.body,
            author: {
                id: req.user?.id,
                name: req.user?.name
            }
        };

        const article = await newsService.createNews(articleData as any);
        res.status(201).json({
            success: true,
            message: 'Tạo bài viết thành công',
            data: article
        });
        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update news article
 * PUT /api/v1/news/:id
 */
export const updateNews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            author: {
                id: req.user?.id,
                name: req.user?.name
            }
        };

        const article = await newsService.updateNews(id as string, updateData);

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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete news article
 * DELETE /api/v1/news/:id
 */
export const deleteNews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await newsService.deleteNews(id as string);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Publish news article
 * POST /api/v1/news/:id/publish
 */
export const publishNews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const article = await newsService.publishNews(id as string);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xuất bản bài viết',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get news categories
 * GET /api/v1/news-categories
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
        });
        return;
    }
};

/**
 * Create news category
 * POST /api/v1/news-categories
 */
export const createNewsCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const category = await newsService.createNewsCategory(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo chuyên mục thành công',
            data: category
        });
        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update news category
 * PUT /api/v1/news-categories/:id
 */
export const updateNewsCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const category = await newsService.updateNewsCategory(id as string, req.body);

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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete news category
 * DELETE /api/v1/news-categories/:id
 */
export const deleteNewsCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await newsService.deleteNewsCategory(id as string);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa chuyên mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get news tags
 * GET /api/v1/news-tags
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
        });
        return;
    }
};

/**
 * Create news tag
 * POST /api/v1/news-tags
 */
export const createNewsTag = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tag = await newsService.createNewsTag(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo tag thành công',
            data: tag
        });
        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo tag',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update news tag
 * PUT /api/v1/news-tags/:id
 */
export const updateNewsTag = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tag = await newsService.updateNewsTag(id as string, req.body);

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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật tag',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete news tag
 * DELETE /api/v1/news-tags/:id
 */
export const deleteNewsTag = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await newsService.deleteNewsTag(id as string);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa tag',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
