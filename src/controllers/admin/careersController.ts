import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { careersService } from '@/services/admin/careersService';

/**
 * Get all job positions
 * GET /api/v1/admin/careers/positions
 */
export const getJobPositions = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, department, type, status, search } = req.query;
        const positions = await careersService.getJobPositions({
            page: Number(page),
            limit: Number(limit),
            ...(department && { department: department as string }),
            ...(type && { type: type as string }),
            ...(status && { status: status as string }),
            ...(search && { search: search as string })
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
 * Get job position by ID
 * GET /api/v1/admin/careers/positions/:id
 */
export const getJobPositionById = async (req: Request, res: Response) => {
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
 * Create new job position
 * POST /api/v1/admin/careers/positions
 */
export const createJobPosition = async (req: AuthRequest, res: Response) => {
    try {
        const position = await careersService.createJobPosition(req.body, req.user?.id);
        res.json({
            success: true,
            data: position,
            message: 'Tạo vị trí tuyển dụng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update job position
 * PUT /api/v1/admin/careers/positions/:id
 */
export const updateJobPosition = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const position = await careersService.updateJobPosition(id as string, req.body, req.user?.id);
        res.json({
            success: true,
            data: position,
            message: 'Cập nhật vị trí tuyển dụng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete job position
 * DELETE /api/v1/admin/careers/positions/:id
 */
export const deleteJobPosition = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await careersService.deleteJobPosition(id as string);
        res.json({
            success: true,
            message: 'Xóa vị trí tuyển dụng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get job applications
 * GET /api/v1/admin/careers/applications
 */
export const getJobApplications = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, jobPositionId, status, search } = req.query;
        const applications = await careersService.getJobApplications({
            page: Number(page),
            limit: Number(limit),
            ...(jobPositionId && { jobPositionId: jobPositionId as string }),
            ...(status && { status: status as string }),
            ...(search && { search: search as string })
        });
        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách hồ sơ ứng tuyển',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get job application by ID
 * GET /api/v1/admin/careers/applications/:id
 */
export const getJobApplicationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const application = await careersService.getJobApplicationById(id as string);
        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin hồ sơ ứng tuyển',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update job application status
 * PUT /api/v1/admin/careers/applications/:id/status
 */
export const updateJobApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, notes, interviewDate, interviewNotes, rating } = req.body;
        const application = await careersService.updateJobApplicationStatus(id as string, {
            status,
            notes,
            interviewDate,
            interviewNotes,
            rating
        });
        res.json({
            success: true,
            data: application,
            message: 'Cập nhật trạng thái hồ sơ thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái hồ sơ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get careers statistics
 * GET /api/v1/admin/careers/statistics
 */
export const getCareersStatistics = async (req: Request, res: Response) => {
    try {
        const statistics = await careersService.getCareersStatistics();
        res.json({
            success: true,
            data: statistics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get departments list
 * GET /api/v1/admin/careers/departments
 */
export const getDepartments = async (req: Request, res: Response) => {
    try {
        const departments = [
            { value: 'sales', label: 'Kinh doanh' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'construction', label: 'Xây dựng' },
            { value: 'finance', label: 'Tài chính' },
            { value: 'hr', label: 'Nhân sự' },
            { value: 'it', label: 'Công nghệ thông tin' },
            { value: 'admin', label: 'Hành chính' },
            { value: 'operations', label: 'Vận hành' }
        ];
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

/**
 * Submit job application
 * POST /api/v1/admin/careers/apply
 */
export const submitJobApplication = async (req: Request, res: Response) => {
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
