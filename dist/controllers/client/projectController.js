"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectTypes = exports.searchProjects = exports.getProjectFloorPlans = exports.getFeaturedProjects = exports.getProjectBySlug = exports.getProjectById = exports.getProjects = void 0;
const projectService_1 = require("@/services/client/projectService");
const getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, type, location, minPrice, maxPrice } = req.query;
        const filters = {
            ...(search && { search: search }),
            ...(type && { type: type }),
            ...(location && { location: location }),
            ...(minPrice && { minPrice: parseInt(minPrice) }),
            ...(maxPrice && { maxPrice: parseInt(maxPrice) })
        };
        const result = await projectService_1.projectService.getProjects(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.projects,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await projectService_1.projectService.getProjectById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dự án'
            });
            ;
            return;
        }
        res.json({
            success: true,
            data: project
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProjectById = getProjectById;
const getProjectBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const project = await projectService_1.projectService.getProjectBySlug(slug);
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dự án'
            });
            ;
            return;
        }
        res.json({
            success: true,
            data: project
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProjectBySlug = getProjectBySlug;
const getFeaturedProjects = async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        const projects = await projectService_1.projectService.getFeaturedProjects(parseInt(limit));
        res.json({
            success: true,
            data: projects
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dự án nổi bật',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getFeaturedProjects = getFeaturedProjects;
const getProjectFloorPlans = async (req, res) => {
    try {
        const { id } = req.params;
        const floorPlans = await projectService_1.projectService.getProjectFloorPlans(id);
        res.json({
            success: true,
            data: floorPlans
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy mặt bằng dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProjectFloorPlans = getProjectFloorPlans;
const searchProjects = async (req, res) => {
    try {
        const { q, type, location, minPrice, maxPrice, minArea, maxArea } = req.query;
        const searchParams = {
            query: q,
            type: type,
            location: location,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            minArea: minArea ? parseInt(minArea) : undefined,
            maxArea: maxArea ? parseInt(maxArea) : undefined
        };
        const projects = await projectService_1.projectService.searchProjects(searchParams);
        res.json({
            success: true,
            data: projects
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.searchProjects = searchProjects;
const getProjectTypes = async (req, res) => {
    try {
        const types = await projectService_1.projectService.getProjectTypes();
        res.json({
            success: true,
            data: types
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách loại dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProjectTypes = getProjectTypes;
//# sourceMappingURL=projectController.js.map