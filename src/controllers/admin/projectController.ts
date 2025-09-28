import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { projectService } from '@/services/admin/projectService';

/**
 * Get all projects with pagination and filters
 * GET /api/v1/projects
 */
export const getProjects = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search, type, status, location, city, district } = req.query;

        const filters = {
            search: search as string,
            type: type as string,
            status: status as string,
            location: location as string,
            city: city as string,
            district: district as string
        };

        const result = await projectService.getProjects(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.projects,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get project by ID
 * GET /api/v1/projects/:id
 */
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const project = await projectService.getProjectById(id as string);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dự án'
            });;

            return;
            return;
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Create new project
 * POST /api/v1/projects
 */
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projectData = {
            ...req.body,
            createdBy: req.user?.id
        };

        const project = await projectService.createProject(projectData);

        res.status(201).json({
            success: true,
            message: 'Tạo dự án thành công',
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update project
 * PUT /api/v1/projects/:id
 */
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id
        };

        const project = await projectService.updateProject(id as string, updateData);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dự án'
            });;

            return;
            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật dự án thành công',
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Delete project
 * DELETE /api/v1/projects/:id
 */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await projectService.deleteProject(id as string);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dự án'
            });;

            return;
            return;
        }

        res.json({
            success: true,
            message: 'Xóa dự án thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Upload project gallery images
 * POST /api/v1/projects/:id/gallery
 */
export const uploadGalleryImages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
            return;
        }

        const imageUrls = await projectService.uploadGalleryImages(id as string, files);

        res.json({
            success: true,
            message: 'Upload hình ảnh thành công',
            data: { images: imageUrls }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload hình ảnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Delete gallery image
 * DELETE /api/v1/projects/:id/gallery/:imageId
 */
export const deleteGalleryImage = async (req: Request, res: Response) => {
    try {
        const { id, imageId } = req.params;
        await projectService.deleteGalleryImage(id as string, imageId as string);

        res.json({
            success: true,
            message: 'Xóa hình ảnh thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa hình ảnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Add image URL to project gallery
 * POST /api/v1/projects/:id/gallery/url
 */
export const addGalleryImageUrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            res.status(400).json({
                success: false,
                message: 'URL hình ảnh là bắt buộc'
            });
            return;
        }

        // Validate URL format
        try {
            new URL(imageUrl);
        } catch {
            res.status(400).json({
                success: false,
                message: 'URL hình ảnh không hợp lệ'
            });
            return;
        }

        const imageUrls = await projectService.addGalleryImageUrl(id as string, imageUrl);

        res.json({
            success: true,
            message: 'Thêm URL hình ảnh thành công',
            data: { images: imageUrls }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm URL hình ảnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get project types
 * GET /api/v1/projects/types
 */
export const getProjectTypes = async (req: Request, res: Response) => {
    try {
        const types = await projectService.getProjectTypes();
        res.json({
            success: true,
            data: types
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách loại dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};
