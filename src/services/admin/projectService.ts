import { Project, FloorPlan } from '../../models/core';
import { fileService } from '../shared/fileService';

// Debug: Log when fileService is imported
console.log('ProjectService - fileService imported:', !!fileService);

export interface ProjectFilters {
    search?: string;
    type?: string;
    status?: string;
    location?: string;
    city?: string;
    district?: string;
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

class ProjectService {
    /**
     * Get all projects with pagination and filters
     */
    async getProjects(page: number, limit: number, filters: ProjectFilters): Promise<ProjectListResult> {
        try {
            const query: any = {};

            // Apply filters
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

            // Handle location filters - combine city and district if both are provided
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

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await Project.countDocuments(query);

            // Get projects with pagination
            const projects = await Project.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get project by ID
     */
    async getProjectById(id: string): Promise<any> {
        try {
            const project = await Project.findById(id)
                .lean();

            return project;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create new project
     */
    async createProject(projectData: any): Promise<any> {
        try {
            const project = new Project(projectData);
            await project.save();

            return await Project.findById(project._id)
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update project
     */
    async updateProject(id: string, updateData: any): Promise<any> {
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

            const project = await Project.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .lean();

            return project;
        } catch (error) {
            console.log('ProjectService - updateProject error:', error);
            throw new Error(`Lỗi khi cập nhật dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete project
     */
    async deleteProject(id: string): Promise<boolean> {
        try {
            const result = await Project.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Upload gallery images
     */
    async uploadGalleryImages(projectId: string, files: Express.Multer.File[]): Promise<string[]> {
        try {
            const project = await Project.findById(projectId);
            if (!project) {
                throw new Error('Không tìm thấy dự án');
            }

            console.log('ProjectService - uploadGalleryImages called:', {
                projectId,
                filesCount: files.length,
                fileNames: files.map(f => f.originalname)
            });

            const imageUrls = await fileService.uploadImages(files);

            console.log('ProjectService - uploadGalleryImages result:', {
                projectId,
                newImageUrls: imageUrls,
                currentImages: project.images,
                totalImagesAfter: project.images.length + imageUrls.length
            });

            // Add new images to project gallery
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
                        } catch {
                            return false;
                        }
                    })()
                }))
            });

            try {
                await project.save();
                console.log('ProjectService - project saved successfully');
            } catch (saveError) {
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
        } catch (error) {
            console.error('ProjectService - uploadGalleryImages error:', error);
            throw new Error(`Lỗi khi upload hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete gallery image
     */
    async deleteGalleryImage(projectId: string, imageUrl: string): Promise<void> {
        try {
            const project = await Project.findById(projectId);
            if (!project) {
                throw new Error('Không tìm thấy dự án');
            }

            // Remove image from project gallery
            project.images = project.images.filter(img => img !== imageUrl);
            await project.save();

            // Delete file from storage
            await fileService.deleteFileByUrl(imageUrl);
        } catch (error) {
            throw new Error(`Lỗi khi xóa hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Add image URL to gallery
     */
    async addGalleryImageUrl(projectId: string, imageUrl: string): Promise<string[]> {
        try {
            const project = await Project.findById(projectId);
            if (!project) {
                throw new Error('Không tìm thấy dự án');
            }

            // Add URL to project gallery
            project.images = [...project.images, imageUrl];
            await project.save();

            return [imageUrl];
        } catch (error) {
            throw new Error(`Lỗi khi thêm URL hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get project types
     */
    async getProjectTypes(): Promise<string[]> {
        try {
            const types = await Project.distinct('type');
            return types;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách loại dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get project floor plans
     */
    async getProjectFloorPlans(projectId: string): Promise<any[]> {
        try {
            const floorPlans = await FloorPlan.find({ projectId, isActive: true })
                .sort({ name: 1 })
                .lean();

            return floorPlans;
        } catch (error) {
            throw new Error(`Lỗi khi lấy mặt bằng dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create floor plan
     */
    async createFloorPlan(projectId: string, floorPlanData: any): Promise<any> {
        try {
            const floorPlan = new FloorPlan({
                ...floorPlanData,
                projectId
            });
            await floorPlan.save();

            return floorPlan;
        } catch (error) {
            throw new Error(`Lỗi khi tạo mặt bằng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update floor plan
     */
    async updateFloorPlan(floorPlanId: string, updateData: any): Promise<any> {
        try {
            const floorPlan = await FloorPlan.findByIdAndUpdate(
                floorPlanId,
                updateData,
                { new: true, runValidators: true }
            ).lean();

            return floorPlan;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật mặt bằng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete floor plan
     */
    async deleteFloorPlan(floorPlanId: string): Promise<boolean> {
        try {
            const result = await FloorPlan.findByIdAndDelete(floorPlanId);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa mặt bằng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const projectService = new ProjectService();
