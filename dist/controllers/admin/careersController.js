"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitJobApplication = exports.getDepartments = exports.getCareersStatistics = exports.updateJobApplicationStatus = exports.getJobApplicationById = exports.getJobApplications = exports.deleteJobPosition = exports.updateJobPosition = exports.createJobPosition = exports.getJobPositionById = exports.getJobPositions = void 0;
const careersService_1 = require("@/services/admin/careersService");
const getJobPositions = async (req, res) => {
    try {
        const { page = 1, limit = 10, department, type, status, search } = req.query;
        const positions = await careersService_1.careersService.getJobPositions({
            page: Number(page),
            limit: Number(limit),
            ...(department && { department: department }),
            ...(type && { type: type }),
            ...(status && { status: status }),
            ...(search && { search: search })
        });
        res.json({
            success: true,
            data: positions
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getJobPositions = getJobPositions;
const getJobPositionById = async (req, res) => {
    try {
        const { id } = req.params;
        const position = await careersService_1.careersService.getJobPositionById(id);
        res.json({
            success: true,
            data: position
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getJobPositionById = getJobPositionById;
const createJobPosition = async (req, res) => {
    try {
        const position = await careersService_1.careersService.createJobPosition(req.body, req.user?.id);
        res.json({
            success: true,
            data: position,
            message: 'Tạo vị trí tuyển dụng thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createJobPosition = createJobPosition;
const updateJobPosition = async (req, res) => {
    try {
        const { id } = req.params;
        const position = await careersService_1.careersService.updateJobPosition(id, req.body, req.user?.id);
        res.json({
            success: true,
            data: position,
            message: 'Cập nhật vị trí tuyển dụng thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateJobPosition = updateJobPosition;
const deleteJobPosition = async (req, res) => {
    try {
        const { id } = req.params;
        await careersService_1.careersService.deleteJobPosition(id);
        res.json({
            success: true,
            message: 'Xóa vị trí tuyển dụng thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vị trí tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteJobPosition = deleteJobPosition;
const getJobApplications = async (req, res) => {
    try {
        const { page = 1, limit = 10, jobPositionId, status, search } = req.query;
        const applications = await careersService_1.careersService.getJobApplications({
            page: Number(page),
            limit: Number(limit),
            ...(jobPositionId && { jobPositionId: jobPositionId }),
            ...(status && { status: status }),
            ...(search && { search: search })
        });
        res.json({
            success: true,
            data: applications
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách hồ sơ ứng tuyển',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getJobApplications = getJobApplications;
const getJobApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await careersService_1.careersService.getJobApplicationById(id);
        res.json({
            success: true,
            data: application
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin hồ sơ ứng tuyển',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getJobApplicationById = getJobApplicationById;
const updateJobApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, interviewDate, interviewNotes, rating } = req.body;
        const application = await careersService_1.careersService.updateJobApplicationStatus(id, {
            status,
            notes,
            interviewDate,
            interviewNotes,
            rating
        });
        res.json({
            success: true,
            data: application,
            message: 'Cập nhật trạng thái hồ sơ thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái hồ sơ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateJobApplicationStatus = updateJobApplicationStatus;
const getCareersStatistics = async (req, res) => {
    try {
        const statistics = await careersService_1.careersService.getCareersStatistics();
        res.json({
            success: true,
            data: statistics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê tuyển dụng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getCareersStatistics = getCareersStatistics;
const getDepartments = async (req, res) => {
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
        res.json({
            success: true,
            data: departments
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách phòng ban',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getDepartments = getDepartments;
const submitJobApplication = async (req, res) => {
    try {
        const application = await careersService_1.careersService.submitJobApplication(req.body, req.ip, req.get('User-Agent'));
        res.json({
            success: true,
            data: application,
            message: 'Nộp hồ sơ ứng tuyển thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi nộp hồ sơ ứng tuyển',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.submitJobApplication = submitJobApplication;
