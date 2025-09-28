"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const core_1 = require("@/models/core");
class ProjectService {
    async getProjects(page, limit, filters) {
        try {
            const query = {
                isActive: true,
                status: { $in: ['planning', 'construction', 'completed'] }
            };
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
            const skip = (page - 1) * limit;
            const total = await core_1.Project.countDocuments(query);
            const projects = await core_1.Project.find(query)
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProjectById(id) {
        try {
            const project = await core_1.Project.findOne({
                _id: id,
                isActive: true
            })
                .select('-createdBy -updatedBy -__v')
                .lean();
            return project;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProjectBySlug(slug) {
        try {
            const project = await core_1.Project.findOne({
                slug,
                isActive: true
            })
                .select('-createdBy -updatedBy -__v')
                .lean();
            return project;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getFeaturedProjects(limit = 6) {
        try {
            const projects = await core_1.Project.find({
                isActive: true,
                isFeatured: true,
                status: { $in: ['planning', 'construction', 'completed'] }
            })
                .select('-createdBy -updatedBy -__v')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            return projects;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy dự án nổi bật: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProjectFloorPlans(projectId) {
        try {
            const floorPlans = await core_1.FloorPlan.find({
                projectId,
                isActive: true
            })
                .sort({ name: 1 })
                .lean();
            return floorPlans;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy mặt bằng dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async searchProjects(searchParams) {
        try {
            const query = {
                isActive: true,
                status: { $in: ['planning', 'construction', 'completed'] }
            };
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
            const projects = await core_1.Project.find(query)
                .select('-createdBy -updatedBy -__v')
                .sort({ isFeatured: -1, createdAt: -1 })
                .lean();
            return projects;
        }
        catch (error) {
            throw new Error(`Lỗi khi tìm kiếm dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProjectTypes() {
        try {
            const types = await core_1.Project.distinct('type', { isActive: true });
            return types;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách loại dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.projectService = new ProjectService();
//# sourceMappingURL=projectService.js.map