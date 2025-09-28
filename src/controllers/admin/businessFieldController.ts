import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { businessFieldService } from '@/services/admin/businessFieldService';

/**
 * Get all business fields
 * GET /api/v1/admin/business-fields
 */
export const getBusinessFields = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search, isActive, isFeatured } = req.query;
        const fields = await businessFieldService.getBusinessFields({
            page: Number(page),
            limit: Number(limit),
            ...(search && { search: search as string }),
            ...(isActive !== undefined && { isActive: isActive === 'true' }),
            ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' })
        });
        res.json({
            success: true,
            data: fields
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get business field by ID
 * GET /api/v1/admin/business-fields/:id
 */
export const getBusinessFieldById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const field = await businessFieldService.getBusinessFieldById(id as string);
        res.json({
            success: true,
            data: field
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Create new business field
 * POST /api/v1/admin/business-fields
 */
export const createBusinessField = async (req: AuthRequest, res: Response) => {
    try {
        const field = await businessFieldService.createBusinessField(req.body, req.user?.id);
        res.json({
            success: true,
            data: field,
            message: 'Tạo lĩnh vực hoạt động thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update business field
 * PUT /api/v1/admin/business-fields/:id
 */
export const updateBusinessField = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const field = await businessFieldService.updateBusinessField(id as string, req.body, req.user?.id);
        res.json({
            success: true,
            data: field,
            message: 'Cập nhật lĩnh vực hoạt động thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete business field
 * DELETE /api/v1/admin/business-fields/:id
 */
export const deleteBusinessField = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await businessFieldService.deleteBusinessField(id as string);
        res.json({
            success: true,
            message: 'Xóa lĩnh vực hoạt động thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update business field sort order
 * PUT /api/v1/admin/business-fields/sort
 */
export const updateBusinessFieldSortOrder = async (req: Request, res: Response) => {
    try {
        const { fields } = req.body;
        await businessFieldService.updateBusinessFieldSortOrder(fields);
        res.json({
            success: true,
            message: 'Cập nhật thứ tự thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thứ tự',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Toggle business field status
 * PUT /api/v1/admin/business-fields/:id/toggle-status
 */
export const toggleBusinessFieldStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const field = await businessFieldService.toggleBusinessFieldStatus(id as string);
        res.json({
            success: true,
            data: field,
            message: 'Cập nhật trạng thái thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
