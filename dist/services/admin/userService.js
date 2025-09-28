"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const core_1 = require("@/models/core");
class UserService {
    async getUsers(page, limit, filters) {
        try {
            const query = {};
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } },
                    { phone: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.role) {
                query.role = filters.role;
            }
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.type) {
                query.type = filters.type;
            }
            const skip = (page - 1) * limit;
            const total = await core_1.User.countDocuments(query);
            const users = await core_1.User.find(query)
                .populate('roles', 'name displayName')
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getUserById(id) {
        try {
            const user = await core_1.User.findById(id)
                .populate('roles', 'name displayName permissions')
                .select('-password')
                .lean();
            return user;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createUser(userData) {
        try {
            const user = new core_1.User(userData);
            await user.save();
            return await core_1.User.findById(user._id)
                .populate('roles', 'name displayName')
                .select('-password')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateUser(id, updateData) {
        try {
            const user = await core_1.User.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('roles', 'name displayName')
                .select('-password')
                .lean();
            return user;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteUser(id) {
        try {
            const result = await core_1.User.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getRoles() {
        try {
            const roles = await core_1.Role.find({ isActive: true })
                .populate('permissions', 'name displayName module action')
                .sort({ name: 1 })
                .lean();
            return roles;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createRole(roleData) {
        try {
            const role = new core_1.Role(roleData);
            await role.save();
            return await core_1.Role.findById(role._id)
                .populate('permissions', 'name displayName module action')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateRole(id, updateData) {
        try {
            const role = await core_1.Role.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
                .populate('permissions', 'name displayName module action')
                .lean();
            return role;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteRole(id) {
        try {
            const userCount = await core_1.User.countDocuments({ roles: id });
            if (userCount > 0) {
                throw new Error('Không thể xóa vai trò đang được gán cho người dùng');
            }
            const result = await core_1.Role.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getPermissions() {
        try {
            const permissions = await core_1.Permission.find({ isActive: true })
                .sort({ module: 1, action: 1 })
                .lean();
            return permissions;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách quyền: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async assignUserRoles(userId, roleIds) {
        try {
            const user = await core_1.User.findByIdAndUpdate(userId, { roles: roleIds }, { new: true, runValidators: true })
                .populate('roles', 'name displayName permissions')
                .select('-password')
                .lean();
            return user;
        }
        catch (error) {
            throw new Error(`Lỗi khi gán vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getActivityLogs(page, limit, filters) {
        try {
            const query = {};
            if (filters.userId) {
                query.userId = filters.userId;
            }
            if (filters.action) {
                query.action = { $regex: filters.action, $options: 'i' };
            }
            if (filters.resourceType) {
                query.resourceType = filters.resourceType;
            }
            const skip = (page - 1) * limit;
            const total = await core_1.ActivityLog.countDocuments(query);
            const logs = await core_1.ActivityLog.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy lịch sử hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getActivityLogsByUser(userId, page, limit) {
        try {
            const query = { userId };
            const skip = (page - 1) * limit;
            const total = await core_1.ActivityLog.countDocuments(query);
            const logs = await core_1.ActivityLog.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy lịch sử hoạt động của người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async cleanupActivityLogs(days) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            const result = await core_1.ActivityLog.deleteMany({ createdAt: { $lt: cutoffDate } });
            return result.deletedCount || 0;
        }
        catch (error) {
            throw new Error(`Lỗi khi dọn dẹp log cũ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.userService = new UserService();
