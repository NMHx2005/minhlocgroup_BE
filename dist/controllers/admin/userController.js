"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupActivityLogs = exports.getActivityLogsByUser = exports.getActivityLogs = exports.assignUserRoles = exports.getPermissions = exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoles = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const userService_1 = require("@/services/admin/userService");
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role, status, type } = req.query;
        const filters = {
            search: search,
            role: role,
            status: status,
            type: type
        };
        const result = await userService_1.userService.getUsers(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.users,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService_1.userService.getUserById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
            ;
            return;
        }
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const userData = {
            ...req.body,
            createdBy: req.user?.id
        };
        const user = await userService_1.userService.createUser(userData);
        res.status(201).json({
            success: true,
            message: 'Tạo người dùng thành công',
            data: user
        });
        ;
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id
        };
        const user = await userService_1.userService.updateUser(id, updateData);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: user
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await userService_1.userService.deleteUser(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.deleteUser = deleteUser;
const getRoles = async (req, res) => {
    try {
        const roles = await userService_1.userService.getRoles();
        res.json({
            success: true,
            data: roles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getRoles = getRoles;
const createRole = async (req, res) => {
    try {
        const role = await userService_1.userService.createRole(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo vai trò thành công',
            data: role
        });
        ;
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.createRole = createRole;
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await userService_1.userService.updateRole(id, req.body);
        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy vai trò'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Cập nhật vai trò thành công',
            data: role
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await userService_1.userService.deleteRole(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy vai trò'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Xóa vai trò thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.deleteRole = deleteRole;
const getPermissions = async (req, res) => {
    try {
        const permissions = await userService_1.userService.getPermissions();
        res.json({
            success: true,
            data: permissions
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách quyền',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getPermissions = getPermissions;
const assignUserRoles = async (req, res) => {
    try {
        const { id } = req.params;
        const { roles } = req.body;
        const user = await userService_1.userService.assignUserRoles(id, roles);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
            ;
            return;
        }
        res.json({
            success: true,
            message: 'Gán vai trò thành công',
            data: user
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gán vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.assignUserRoles = assignUserRoles;
const getActivityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId, action, resourceType } = req.query;
        const filters = {
            userId: userId,
            action: action,
            resourceType: resourceType
        };
        const result = await userService_1.userService.getActivityLogs(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.logs,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getActivityLogs = getActivityLogs;
const getActivityLogsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const result = await userService_1.userService.getActivityLogsByUser(userId, parseInt(page), parseInt(limit));
        res.json({
            success: true,
            data: result.logs,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử hoạt động của người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getActivityLogsByUser = getActivityLogsByUser;
const cleanupActivityLogs = async (req, res) => {
    try {
        const { days = 90 } = req.query;
        const deletedCount = await userService_1.userService.cleanupActivityLogs(parseInt(days));
        res.json({
            success: true,
            message: `Đã xóa ${deletedCount} log cũ`,
            data: { deletedCount }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi dọn dẹp log cũ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.cleanupActivityLogs = cleanupActivityLogs;
//# sourceMappingURL=userController.js.map