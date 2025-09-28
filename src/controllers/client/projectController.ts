import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { projectService } from '@/services/client/projectService';

/**
 * Get all active projects for client
 * GET /api/v1/client/projects
 */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, type, location, minPrice, maxPrice } = req.query;

        const filters = {
            ...(search && { search: search as string }),
            ...(type && { type: type as string }),
            ...(location && { location: location as string }),
            ...(minPrice && { minPrice: parseInt(minPrice as string) }),
            ...(maxPrice && { maxPrice: parseInt(maxPrice as string) })
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
 * Get project by ID for client
 * GET /api/v1/client/projects/:id
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
 * Get project by slug for client
 * GET /api/v1/client/projects/slug/:slug
 */
export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const project = await projectService.getProjectBySlug(slug as string);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dự án'
            });;

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
 * Get featured projects
 * GET /api/v1/client/projects/featured
 */
export const getFeaturedProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const { limit = 6 } = req.query;
        const projects = await projectService.getFeaturedProjects(parseInt(limit as string));

        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dự án nổi bật',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get project floor plans
 * GET /api/v1/client/projects/:id/floor-plans
 */
export const getProjectFloorPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const floorPlans = await projectService.getProjectFloorPlans(id as string);

        res.json({
            success: true,
            data: floorPlans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy mặt bằng dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Search projects
 * GET /api/v1/client/projects/search
 */
export const searchProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, type, location, minPrice, maxPrice, minArea, maxArea } = req.query;

        const searchParams = {
            query: q as string,
            type: type as string,
            location: location as string,
            minPrice: minPrice ? parseInt(minPrice as string) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
            minArea: minArea ? parseInt(minArea as string) : undefined,
            maxArea: maxArea ? parseInt(maxArea as string) : undefined
        };

        const projects = await projectService.searchProjects(searchParams as any);

        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get project types
 * GET /api/v1/client/projects/types
 */
export const getProjectTypes = async (req: Request, res: Response): Promise<void> => {
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
