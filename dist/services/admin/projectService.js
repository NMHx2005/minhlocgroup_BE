"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const core_1 = require("@/models/core");
const fileService_1 = require("@/services/shared/fileService");
console.log('ProjectService - fileService imported:', !!fileService_1.fileService);
class ProjectService {
    async getProjects(page, limit, filters) {
        try {
            const query = {};
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { location: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.type && filters.type !== 'all') {
                query.type = filters.type;
            }
            if (filters.status && filters.status !== 'all') {
                query.status = filters.status;
            }
            const locationFilters = [];
            if (filters.location) {
                locationFilters.push({ location: { $regex: filters.location, $options: 'i' } });
            }
            if (filters.city && filters.city !== 'all') {
                locationFilters.push({ location: { $regex: filters.city, $options: 'i' } });
            }
            if (filters.district && filters.district !== 'all') {
                locationFilters.push({ location: { $regex: filters.district, $options: 'i' } });
            }
            if (locationFilters.length > 0) {
                query.$and = query.$and || [];
                query.$and.push({ $or: locationFilters });
            }
            const skip = (page - 1) * limit;
            const total = await core_1.Project.countDocuments(query);
            const projects = await core_1.Project.find(query)
                .sort({ createdAt: -1 })
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
            const project = await core_1.Project.findById(id)
                .lean();
            return project;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createProject(projectData) {
        try {
            const project = new core_1.Project(projectData);
            await project.save();
            return await core_1.Project.findById(project._id)
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateProject(id, updateData) {
        try {
            console.log('ProjectService - updateProject called:', {
                id,
                updateData: {
                    name: updateData.name,
                    description: updateData.description,
                    descriptionLength: updateData.description?.length,
                    type: updateData.type
                }
            });
            const project = await core_1.Project.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true })
                .lean();
            return project;
        }
        catch (error) {
            console.log('ProjectService - updateProject error:', error);
            throw new Error(`Lỗi khi cập nhật dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteProject(id) {
        try {
            const result = await core_1.Project.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadGalleryImages(projectId, files) {
        try {
            const project = await core_1.Project.findById(projectId);
            if (!project) {
                throw new Error('Không tìm thấy dự án');
            }
            console.log('ProjectService - uploadGalleryImages called:', {
                projectId,
                filesCount: files.length,
                fileNames: files.map(f => f.originalname)
            });
            const imageUrls = await fileService_1.fileService.uploadImages(files);
            console.log('ProjectService - uploadGalleryImages result:', {
                projectId,
                newImageUrls: imageUrls,
                currentImages: project.images,
                totalImagesAfter: project.images.length + imageUrls.length
            });
            project.images = [...project.images, ...imageUrls];
            console.log('ProjectService - saving project with images:', {
                projectId,
                allImages: project.images,
                imageCount: project.images.length,
                imageValidation: project.images.map((url, index) => ({
                    index,
                    url,
                    isValid: (() => {
                        try {
                            const urlObj = new URL(url);
                            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
                        }
                        catch {
                            return false;
                        }
                    })()
                }))
            });
            try {
                await project.save();
                console.log('ProjectService - project saved successfully');
            }
            catch (saveError) {
                console.error('ProjectService - save error:', saveError);
                if (saveError instanceof Error && saveError.message.includes('validation failed')) {
                    console.error('Validation error details:', {
                        projectId,
                        images: project.images,
                        error: saveError.message
                    });
                }
                throw saveError;
            }
            return imageUrls;
        }
        catch (error) {
            console.error('ProjectService - uploadGalleryImages error:', error);
            throw new Error(`Lỗi khi upload hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteGalleryImage(projectId, imageUrl) {
        try {
            const project = await core_1.Project.findById(projectId);
            if (!project) {
                throw new Error('Không tìm thấy dự án');
            }
            project.images = project.images.filter(img => img !== imageUrl);
            await project.save();
            await fileService_1.fileService.deleteFileByUrl(imageUrl);
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addGalleryImageUrl(projectId, imageUrl) {
        try {
            const project = await core_1.Project.findById(projectId);
            if (!project) {
                throw new Error('Không tìm thấy dự án');
            }
            project.images = [...project.images, imageUrl];
            await project.save();
            return [imageUrl];
        }
        catch (error) {
            throw new Error(`Lỗi khi thêm URL hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProjectTypes() {
        try {
            const types = await core_1.Project.distinct('type');
            return types;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách loại dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProjectFloorPlans(projectId) {
        try {
            const floorPlans = await core_1.FloorPlan.find({ projectId, isActive: true })
                .sort({ name: 1 })
                .lean();
            return floorPlans;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy mặt bằng dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createFloorPlan(projectId, floorPlanData) {
        try {
            const floorPlan = new core_1.FloorPlan({
                ...floorPlanData,
                projectId
            });
            await floorPlan.save();
            return floorPlan;
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo mặt bằng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateFloorPlan(floorPlanId, updateData) {
        try {
            const floorPlan = await core_1.FloorPlan.findByIdAndUpdate(floorPlanId, updateData, { new: true, runValidators: true }).lean();
            return floorPlan;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật mặt bằng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteFloorPlan(floorPlanId) {
        try {
            const result = await core_1.FloorPlan.findByIdAndDelete(floorPlanId);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa mặt bằng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.projectService = new ProjectService();
