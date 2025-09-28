"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careersService = void 0;
const core_1 = require("@/models/core");
const mongoose_1 = require("mongoose");
exports.careersService = {
    async getJobPositions(options) {
        try {
            const { page, limit, department, type, status, search } = options;
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
            if (status)
                filter.status = status;
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            const positions = await core_1.JobPosition.find(filter)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort({ priority: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await core_1.JobPosition.countDocuments(filter);
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
            const position = await core_1.JobPosition.findById(id)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email');
            if (!position) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async createJobPosition(data, userId) {
        try {
            let slug = data.slug;
            if (!slug && data.title) {
                slug = data.title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
            }
            const position = new core_1.JobPosition({
                ...data,
                slug,
                createdBy: new mongoose_1.Types.ObjectId(userId),
                updatedBy: new mongoose_1.Types.ObjectId(userId)
            });
            await position.save();
            return position;
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async updateJobPosition(id, data, userId) {
        try {
            const position = await core_1.JobPosition.findByIdAndUpdate(id, {
                ...data,
                updatedBy: new mongoose_1.Types.ObjectId(userId)
            }, { new: true });
            if (!position) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async deleteJobPosition(id) {
        try {
            const position = await core_1.JobPosition.findByIdAndDelete(id);
            if (!position) {
                throw new Error('Không tìm thấy vị trí tuyển dụng');
            }
            return position;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa vị trí tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async getJobApplications(options) {
        try {
            const { page, limit, jobPositionId, status, search } = options;
            const skip = (page - 1) * limit;
            const filter = {};
            if (jobPositionId)
                filter.jobPositionId = new mongoose_1.Types.ObjectId(jobPositionId);
            if (status)
                filter.status = status;
            if (search) {
                filter.$or = [
                    { applicantName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            const applications = await core_1.JobApplication.find(filter)
                .populate('jobPositionId', 'title department')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await core_1.JobApplication.countDocuments(filter);
            return {
                applications,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách hồ sơ ứng tuyển: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async getJobApplicationById(id) {
        try {
            const application = await core_1.JobApplication.findById(id)
                .populate('jobPositionId', 'title department location type salary');
            if (!application) {
                throw new Error('Không tìm thấy hồ sơ ứng tuyển');
            }
            return application;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin hồ sơ ứng tuyển: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async updateJobApplicationStatus(id, data) {
        try {
            const application = await core_1.JobApplication.findByIdAndUpdate(id, data, { new: true });
            if (!application) {
                throw new Error('Không tìm thấy hồ sơ ứng tuyển');
            }
            return application;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái hồ sơ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    async getCareersStatistics() {
        try {
            const [totalPositions, activePositions, totalApplications, applicationsByStatus, positionsByDepartment] = await Promise.all([
                core_1.JobPosition.countDocuments(),
                core_1.JobPosition.countDocuments({ isActive: true, status: 'published' }),
                core_1.JobApplication.countDocuments(),
                core_1.JobApplication.aggregate([
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                core_1.JobPosition.aggregate([
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thống kê tuyển dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    }
};
//# sourceMappingURL=careersService.js.map