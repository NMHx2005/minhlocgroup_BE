import { Request, Response } from 'express';
import { companyService } from '../../services/client/companyService';

/**
 * Get company info for public display
 * GET /api/v1/client/company/info
 */
export const getCompanyInfo = async (req: Request, res: Response) => {
    try {
        const { section } = req.query;
        const companyInfo = await companyService.getCompanyInfo(section as string);
        res.json({
            success: true,
            data: companyInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin công ty',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
