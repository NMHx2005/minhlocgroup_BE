import { Request, Response } from 'express';
import { businessFieldService } from '../../services/client/businessFieldService';

/**
 * Get business fields for public display
 * GET /api/v1/client/business-fields
 */
export const getBusinessFields = async (req: Request, res: Response) => {
    try {
        const { search, isFeatured } = req.query;
        const fields = await businessFieldService.getBusinessFields({
            ...(search && { search: search as string }),
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
        });;

        return;
    }
};

/**
 * Get business field by slug for public display
 * GET /api/v1/client/business-fields/:slug
 */
export const getBusinessFieldBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const field = await businessFieldService.getBusinessFieldBySlug(slug as string);
        res.json({
            success: true,
            data: field
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin lĩnh vực hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};
