import { JobPosition, JobApplication } from '../../models/core';
import { Types } from 'mongoose';

export const careersService = {
    /**
     * Get job positions with pagination and filters
     */
    async getJobPositions(options: {
        page: number;
        limit: number;
        department?: string;
        type?: string;
        status?: string;
        search?: string;
    }) {
        try {
            const { page, limit, department, type, status, search } = options;
            const skip = (page - 1) * limit;

            // Build filter query - only show published and active positions for client
            const filter: any = {
                status: 'published',
                isActive: true,
                deadline: { $gt: new Date() }
            };
            if (department) filter.department = department;
            if (type) filter.type = type;
            if (status) filter.status = status;
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const positions = await JobPosition.find(filter)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort({ priority: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await JobPosition.countDocuments(filter);

            return {
                positions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Get job position by ID
     */
    async getJobPositionById(id: string) {
        try {
            const position = await JobPosition.findById(id)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email');

            if (!position) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Create new job position
     */
    async createJobPosition(data: any, userId: string) {
        try {
            // Generate slug from title if not provided
            let slug = data.slug;
            if (!slug && data.title) {
                slug = data.title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
            }

            const position = new JobPosition({
                ...data,
                slug,
                createdBy: new Types.ObjectId(userId),
                updatedBy: new Types.ObjectId(userId)
            });
            await position.save();
            return position;
        } catch (error) {
            throw new Error(`Lỗi khi tạo vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Update job position
     */
    async updateJobPosition(id: string, data: any, userId: string) {
        try {
            const position = await JobPosition.findByIdAndUpdate(
                id,
                {
                    ...data,
                    updatedBy: new Types.ObjectId(userId)
                },
                { new: true }
            );

            if (!position) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Delete job position
     */
    async deleteJobPosition(id: string) {
        try {
            const position = await JobPosition.findByIdAndDelete(id);
            if (!position) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        } catch (error) {
            throw new Error(`Lỗi khi xóa vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Get job applications with pagination and filters
     */
    async getJobApplications(options: {
        page: number;
        limit: number;
        jobPositionId?: string;
        status?: string;
        search?: string;
    }) {
        try {
            const { page, limit, jobPositionId, status, search } = options;
            const skip = (page - 1) * limit;

            // Build filter query
            const filter: any = {};
            if (jobPositionId) filter.jobPositionId = new Types.ObjectId(jobPositionId);
            if (status) filter.status = status;
            if (search) {
                filter.$or = [
                    { applicantName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const applications = await JobApplication.find(filter)
                .populate('jobPositionId', 'title department')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await JobApplication.countDocuments(filter);

            return {
                applications,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách hồ sơ ứng tuyển: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Get job application by ID
     */
    async getJobApplicationById(id: string) {
        try {
            const application = await JobApplication.findById(id)
                .populate('jobPositionId', 'title department location type salary');

            if (!application) {
                throw new Error('Không tìm thấy hồ sơ ứng tuyển');
            }
            return application;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin hồ sơ ứng tuyển: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Update job application status
     */
    async updateJobApplicationStatus(id: string, data: {
        status: string;
        notes?: string;
        interviewDate?: Date;
        interviewNotes?: string;
        rating?: number;
    }) {
        try {
            const application = await JobApplication.findByIdAndUpdate(
                id,
                data,
                { new: true }
            );

            if (!application) {
                throw new Error('Không tìm thấy hồ sơ ứng tuyển');
            }
            return application;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái hồ sơ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Get careers statistics
     */
    async getCareersStatistics() {
        try {
            const [
                totalPositions,
                activePositions,
                totalApplications,
                applicationsByStatus,
                positionsByDepartment
            ] = await Promise.all([
                JobPosition.countDocuments(),
                JobPosition.countDocuments({ isActive: true, status: 'published' }),
                JobApplication.countDocuments(),
                JobApplication.aggregate([
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                JobPosition.aggregate([
                    { $group: { _id: '$department', count: { $sum: 1 } } }
                ])
            ]);

            return {
                totalPositions,
                activePositions,
                totalApplications,
                applicationsByStatus,
                positionsByDepartment
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy thống kê tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Submit job application
     */
    async submitJobApplication(data: any, ipAddress?: string, userAgent?: string) {
        try {
            const application = new JobApplication({
                ...data,
                jobPositionId: new Types.ObjectId(data.jobPositionId),
                source: 'website',
                ipAddress,
                userAgent
            });
            await application.save();
            return application;
        } catch (error) {
            throw new Error(`Lỗi khi nộp hồ sơ ứng tuyển: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
