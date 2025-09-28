import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { companyService } from '@/services/admin/companyService';

/**
 * Get all company info sections
 * GET /api/v1/admin/company/info
 */
export const getCompanyInfo = async (req: Request, res: Response) => {
    try {
        const { section } = req.query;
        const companyInfo = await companyService.getCompanyInfo(section ? section as string : undefined);
        res.json({
            success: true,
            data: companyInfo
        });
    } catch (error) {res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin công ty',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Create or update company info section
 * POST /api/v1/admin/company/info
 */
export const createOrUpdateCompanyInfo = async (req: AuthRequest, res: Response) => {
    try {
        const companyInfo = await companyService.createOrUpdateCompanyInfo(req.body, req.user?.id);
        res.json({
            success: true,
            data: companyInfo,
            message: 'Cập nhật thông tin công ty thành công'
        });
    } catch (error) {res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thông tin công ty',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Delete company info section
 * DELETE /api/v1/admin/company/info/:id
 */
export const deleteCompanyInfo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await companyService.deleteCompanyInfo(id as string);
        res.json({
            success: true,
            message: 'Xóa thông tin công ty thành công'
        });
    } catch (error) {res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa thông tin công ty',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update company info sort order
 * PUT /api/v1/admin/company/info/sort
 */
export const updateCompanyInfoSortOrder = async (req: Request, res: Response) => {
    try {
        const { sections } = req.body;
        await companyService.updateCompanyInfoSortOrder(sections);
        res.json({
            success: true,
            message: 'Cập nhật thứ tự thành công'
        });
    } catch (error) {res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thứ tự',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};
