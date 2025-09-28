import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import newsCategoryService from '../../services/admin/newsCategoryService';

/**
 * Get all news categories
 * GET /api/v1/admin/news-categories
 */
export const getNewsCategories = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const categories = await newsCategoryService.getCategories();
        res.json({
            success: true,
            message: 'Lấy danh sách danh mục thành công',
            data: categories
        });
        return;
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get active news categories
 * GET /api/v1/admin/news-categories/active
 */
export const getActiveNewsCategories = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const categories = await newsCategoryService.getActiveCategories();
        res.json({
            success: true,
            message: 'Lấy danh sách danh mục hoạt động thành công',
            data: categories
        });
        return;
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách danh mục hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get news category by ID
 * GET /api/v1/admin/news-categories/:id
 */
export const getNewsCategoryById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID danh mục là bắt buộc'
            });
            return;
        }
        const category = await newsCategoryService.getCategoryById(id);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Create new news category
 * POST /api/v1/admin/news-categories
 */
export const createNewsCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const category = await newsCategoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo danh mục thành công',
            data: category
        });
        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update news category
 * PUT /api/v1/admin/news-categories/:id
 */
export const updateNewsCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID danh mục là bắt buộc'
            });
            return;
        }
        const category = await newsCategoryService.updateCategory(id, req.body);

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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete news category
 * DELETE /api/v1/admin/news-categories/:id
 */
export const deleteNewsCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID danh mục là bắt buộc'
            });
            return;
        }
        const deleted = await newsCategoryService.deleteCategory(id);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get category statistics
 * GET /api/v1/admin/news-categories/stats
 */
export const getCategoryStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const stats = await newsCategoryService.getCategoryStats();
        res.json({
            success: true,
            message: 'Lấy thống kê danh mục thành công',
            data: stats
        });
        return;
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Toggle category status
 * PATCH /api/v1/admin/news-categories/:id/toggle-status
 */
export const toggleCategoryStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID danh mục là bắt buộc'
            });
            return;
        }
        const category = await newsCategoryService.toggleCategoryStatus(id);

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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi thay đổi trạng thái danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update sort order
 * PUT /api/v1/admin/news-categories/sort-order
 */
export const updateSortOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { categories } = req.body;

        if (!Array.isArray(categories)) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu thứ tự sắp xếp không hợp lệ'
            });
            return;
        }

        await newsCategoryService.updateSortOrder(categories);
        res.json({
            success: true,
            message: 'Cập nhật thứ tự sắp xếp thành công'
        });
        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật thứ tự sắp xếp',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
