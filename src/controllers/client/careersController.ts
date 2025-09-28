import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { careersService } from '@/services/client/careersService';

/**
 * Get job positions for public display
 * GET /api/v1/client/careers/positions
 */
export const getJobPositions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, department, type, search } = req.query;
        const positions = await careersService.getJobPositions({
            page: Number(page),
            limit: Number(limit),
            department: department as string,
            type: type as string,
            search: search as string
        });
        res.json({
            success: true,
            data: positions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get job position by ID for public display
 * GET /api/v1/client/careers/id/:id
 */
export const getJobPositionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const position = await careersService.getJobPositionById(id as string);
        res.json({
            success: true,
            data: position
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get job position by slug for public display
 * GET /api/v1/client/careers/:slug
 */
export const getJobPositionBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const position = await careersService.getJobPositionBySlug(slug as string);
        res.json({
            success: true,
            data: position
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Submit job application
 * POST /api/v1/client/careers/apply
 */
export const submitJobApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const application = await careersService.submitJobApplication(req.body, req.ip, req.get('User-Agent'));
        res.json({
            success: true,
            data: application,
            message: 'Nộp hồ sơ ứng tuyển thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi nộp hồ sơ ứng tuyển',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get departments list
 * GET /api/v1/client/careers/departments
 */
export const getDepartments = async (req: Request, res: Response): Promise<void> => {
    try {
        const departments = await careersService.getDepartments();
        res.json({
            success: true,
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách phòng ban',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
