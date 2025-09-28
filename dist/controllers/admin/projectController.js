"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectTypes = exports.addGalleryImageUrl = exports.deleteGalleryImage = exports.uploadGalleryImages = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const projectService_1 = require("@/services/admin/projectService");
const getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, type, status, location, city, district } = req.query;
        const filters = {
            search: search,
            type: type,
            status: status,
            location: location,
            city: city,
            district: district
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
const createProject = async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            createdBy: req.user?.id
        };
        const project = await projectService_1.projectService.createProject(projectData);
        res.status(201).json({
            success: true,
            message: 'Tạo dự án thành công',
            data: project
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id
        };
        const project = await projectService_1.projectService.updateProject(id, updateData);
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dự án'
            });
            ;
            return;
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật dự án thành công',
            data: project
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await projectService_1.projectService.deleteProject(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dự án'
            });
            ;
            return;
            return;
        }
        res.json({
            success: true,
            message: 'Xóa dự án thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.deleteProject = deleteProject;
const uploadGalleryImages = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
            return;
        }
        const imageUrls = await projectService_1.projectService.uploadGalleryImages(id, files);
        res.json({
            success: true,
            message: 'Upload hình ảnh thành công',
            data: { images: imageUrls }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload hình ảnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.uploadGalleryImages = uploadGalleryImages;
const deleteGalleryImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;
        await projectService_1.projectService.deleteGalleryImage(id, imageId);
        res.json({
            success: true,
            message: 'Xóa hình ảnh thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa hình ảnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteGalleryImage = deleteGalleryImage;
const addGalleryImageUrl = async (req, res) => {
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
        try {
            new URL(imageUrl);
        }
        catch {
            res.status(400).json({
                success: false,
                message: 'URL hình ảnh không hợp lệ'
            });
            return;
        }
        const imageUrls = await projectService_1.projectService.addGalleryImageUrl(id, imageUrl);
        res.json({
            success: true,
            message: 'Thêm URL hình ảnh thành công',
            data: { images: imageUrls }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm URL hình ảnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.addGalleryImageUrl = addGalleryImageUrl;
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