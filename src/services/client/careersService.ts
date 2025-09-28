import { JobPosition, JobApplication } from '../../models/core';
import { Types } from 'mongoose';

export const careersService = {
    /**
     * Get job positions for public display
     */
    async getJobPositions(options: {
        page: number;
        limit: number;
        department?: string;
        type?: string;
        search?: string;
    }) {
        try {
            const { page, limit, department, type, search } = options;
            const skip = (page - 1) * limit;

            // Build filter query for active and published positions (same as admin)
            const filter: any = {
                status: 'published',
                isActive: true,
                deadline: { $gt: new Date() }
            };

            if (department) filter.department = department;
            if (type) filter.type = type;
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            console.log('🔍 Client careersService filter:', JSON.stringify(filter, null, 2));

            const positions = await JobPosition.find(filter)
                .sort({ priority: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await JobPosition.countDocuments(filter);

            console.log(`📊 Client found ${positions.length} positions out of ${total} total`);

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
     * Get job position by ID for public display
     */
    async getJobPositionById(id: string) {
        try {
            const position = await JobPosition.findById(id);

            if (!position || position.status !== 'published' || !position.isActive) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Get job position by slug for public display
     */
    async getJobPositionBySlug(slug: string) {
        try {
            const position = await JobPosition.findOne({ slug });

            if (!position || position.status !== 'published' || !position.isActive) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    },

    /**
     * Get departments list
     */
    async getDepartments() {
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
            return departments;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách phòng ban: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
