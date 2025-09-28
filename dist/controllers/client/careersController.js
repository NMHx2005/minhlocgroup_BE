"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartments = exports.submitJobApplication = exports.getJobPositionBySlug = exports.getJobPositionById = exports.getJobPositions = void 0;
const careersService_1 = require("@/services/client/careersService");
const getJobPositions = async (req, res) => {
    try {
        const { page = 1, limit = 10, department, type, search } = req.query;
        const positions = await careersService_1.careersService.getJobPositions({
            page: Number(page),
            limit: Number(limit),
            department: department,
            type: type,
            search: search
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
const getJobPositionBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const position = await careersService_1.careersService.getJobPositionBySlug(slug);
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
exports.getJobPositionBySlug = getJobPositionBySlug;
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
const getDepartments = async (req, res) => {
    try {
        const departments = await careersService_1.careersService.getDepartments();
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
//# sourceMappingURL=careersController.js.map