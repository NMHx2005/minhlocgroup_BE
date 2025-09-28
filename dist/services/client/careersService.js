"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careersService = void 0;
const core_1 = require("@/models/core");
const mongoose_1 = require("mongoose");
exports.careersService = {
    async getJobPositions(options) {
        try {
            const { page, limit, department, type, search } = options;
            const skip = (page - 1) * limit;
            const filter = {
                status: 'published',
                isActive: true,
                deadline: { $gt: new Date() }
            };
            if (department)
                filter.department = department;
            if (type)
                filter.type = type;
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            console.log('🔍 Client careersService filter:', JSON.stringify(filter, null, 2));
            const positions = await core_1.JobPosition.find(filter)
                .sort({ priority: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await core_1.JobPosition.countDocuments(filter);
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async getJobPositionById(id) {
        try {
            const position = await core_1.JobPosition.findById(id);
            if (!position || position.status !== 'published' || !position.isActive) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async getJobPositionBySlug(slug) {
        try {
            const position = await core_1.JobPosition.findOne({ slug });
            if (!position || position.status !== 'published' || !position.isActive) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async submitJobApplication(data, ipAddress, userAgent) {
        try {
            const application = new core_1.JobApplication({
                ...data,
                jobPositionId: new mongoose_1.Types.ObjectId(data.jobPositionId),
                source: 'website',
                ipAddress,
                userAgent
            });
            await application.save();
            return application;
        }
        catch (error) {
            throw new Error(`Lỗi khi nộp hồ sơ ứng tuyển: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách phòng ban: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
