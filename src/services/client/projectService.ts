import { Project, FloorPlan } from '../../models/core';

export interface ProjectFilters {
    search?: string;
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface ProjectListResult {
    projects: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ProjectSearchParams {
    query?: string;
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
}

class ProjectService {
    /**
     * Get all active projects for client
     */
    async getProjects(page: number, limit: number, filters: ProjectFilters): Promise<ProjectListResult> {
        try {
            const query: any = {
                isActive: true,
                status: { $in: ['planning', 'construction', 'completed'] }
            };

            // Apply filters
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { location: { $regex: filters.search, $options: 'i' } }
                ];
            }

            if (filters.type) {
                query.type = filters.type;
            }

            if (filters.location) {
                query.location = { $regex: filters.location, $options: 'i' };
            }

            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                query['price.min'] = {};
                if (filters.minPrice !== undefined) {
                    query['price.min'].$gte = filters.minPrice;
                }
                if (filters.maxPrice !== undefined) {
                    query['price.max'] = { $lte: filters.maxPrice };
                }
            }

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await Project.countDocuments(query);

            // Get projects with pagination
            const projects = await Project.find(query)
                .select('-createdBy -updatedBy -__v')
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return {
                projects,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get project by ID for client
     */
    async getProjectById(id: string): Promise<any> {
        try {
            const project = await Project.findOne({
                _id: id,
                isActive: true
            })
                .select('-createdBy -updatedBy -__v')
                .lean();

            return project;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get project by slug for client
     */
    async getProjectBySlug(slug: string): Promise<any> {
        try {
            const project = await Project.findOne({
                slug,
                isActive: true
            })
                .select('-createdBy -updatedBy -__v')
                .lean();

            return project;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get featured projects
     */
    async getFeaturedProjects(limit: number = 6): Promise<any[]> {
        try {
            const projects = await Project.find({
                isActive: true,
                isFeatured: true,
                status: { $in: ['planning', 'construction', 'completed'] }
            })
                .select('-createdBy -updatedBy -__v')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();

            return projects;
        } catch (error) {
            throw new Error(`Lỗi khi lấy dự án nổi bật: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get project floor plans
     */
    async getProjectFloorPlans(projectId: string): Promise<any[]> {
        try {
            const floorPlans = await FloorPlan.find({
                projectId,
                isActive: true
            })
                .sort({ name: 1 })
                .lean();

            return floorPlans;
        } catch (error) {
            throw new Error(`Lỗi khi lấy mặt bằng dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Search projects
     */
    async searchProjects(searchParams: ProjectSearchParams): Promise<any[]> {
        try {
            const query: any = {
                isActive: true,
                status: { $in: ['planning', 'construction', 'completed'] }
            };

            // Apply search filters
            if (searchParams.query) {
                query.$or = [
                    { name: { $regex: searchParams.query, $options: 'i' } },
                    { description: { $regex: searchParams.query, $options: 'i' } },
                    { location: { $regex: searchParams.query, $options: 'i' } },
                    { tags: { $in: [new RegExp(searchParams.query, 'i')] } }
                ];
            }

            if (searchParams.type) {
                query.type = searchParams.type;
            }

            if (searchParams.location) {
                query.location = { $regex: searchParams.location, $options: 'i' };
            }

            if (searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined) {
                query['price.min'] = {};
                if (searchParams.minPrice !== undefined) {
                    query['price.min'].$gte = searchParams.minPrice;
                }
                if (searchParams.maxPrice !== undefined) {
                    query['price.max'] = { $lte: searchParams.maxPrice };
                }
            }

            if (searchParams.minArea !== undefined || searchParams.maxArea !== undefined) {
                query['area.min'] = {};
                if (searchParams.minArea !== undefined) {
                    query['area.min'].$gte = searchParams.minArea;
                }
                if (searchParams.maxArea !== undefined) {
                    query['area.max'] = { $lte: searchParams.maxArea };
                }
            }

            const projects = await Project.find(query)
                .select('-createdBy -updatedBy -__v')
                .sort({ isFeatured: -1, createdAt: -1 })
                .lean();

            return projects;
        } catch (error) {
            throw new Error(`Lỗi khi tìm kiếm dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get project types
     */
    async getProjectTypes(): Promise<string[]> {
        try {
            const types = await Project.distinct('type', { isActive: true });
            return types;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách loại dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const projectService = new ProjectService();
