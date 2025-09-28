import { User, Role, Permission, ActivityLog } from '@/models/core';

export interface UserFilters {
    search?: string;
    role?: string;
    status?: string;
    type?: string;
}

export interface UserListResult {
    users: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ActivityLogFilters {
    userId?: string;
    action?: string;
    resourceType?: string;
}

export interface ActivityLogListResult {
    logs: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

class UserService {
    /**
     * Get all users with pagination and filters
     */
    async getUsers(page: number, limit: number, filters: UserFilters): Promise<UserListResult> {
        try {
            const query: any = {};

            // Apply filters
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

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await User.countDocuments(query);

            // Get users with pagination
            const users = await User.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<any> {
        try {
            const user = await User.findById(id)
                .populate('roles', 'name displayName permissions')
                .select('-password')
                .lean();

            return user;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create new user
     */
    async createUser(userData: any): Promise<any> {
        try {
            const user = new User(userData);
            await user.save();

            return await User.findById(user._id)
                .populate('roles', 'name displayName')
                .select('-password')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update user
     */
    async updateUser(id: string, updateData: any): Promise<any> {
        try {
            const user = await User.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('roles', 'name displayName')
                .select('-password')
                .lean();

            return user;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await User.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all roles
     */
    async getRoles(): Promise<any[]> {
        try {
            const roles = await Role.find({ isActive: true })
                .populate('permissions', 'name displayName module action')
                .sort({ name: 1 })
                .lean();

            return roles;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create new role
     */
    async createRole(roleData: any): Promise<any> {
        try {
            const role = new Role(roleData);
            await role.save();

            return await Role.findById(role._id)
                .populate('permissions', 'name displayName module action')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update role
     */
    async updateRole(id: string, updateData: any): Promise<any> {
        try {
            const role = await Role.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )
                .populate('permissions', 'name displayName module action')
                .lean();

            return role;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete role
     */
    async deleteRole(id: string): Promise<boolean> {
        try {
            // Check if role is assigned to users
            const userCount = await User.countDocuments({ roles: id });
            if (userCount > 0) {
                throw new Error('Không thể xóa vai trò đang được gán cho người dùng');
            }

            const result = await Role.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all permissions
     */
    async getPermissions(): Promise<any[]> {
        try {
            const permissions = await Permission.find({ isActive: true })
                .sort({ module: 1, action: 1 })
                .lean();

            return permissions;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách quyền: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Assign roles to user
     */
    async assignUserRoles(userId: string, roleIds: string[]): Promise<any> {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { roles: roleIds },
                { new: true, runValidators: true }
            )
                .populate('roles', 'name displayName permissions')
                .select('-password')
                .lean();

            return user;
        } catch (error) {
            throw new Error(`Lỗi khi gán vai trò: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get activity logs
     */
    async getActivityLogs(page: number, limit: number, filters: ActivityLogFilters): Promise<ActivityLogListResult> {
        try {
            const query: any = {};

            // Apply filters
            if (filters.userId) {
                query.userId = filters.userId;
            }

            if (filters.action) {
                query.action = { $regex: filters.action, $options: 'i' };
            }

            if (filters.resourceType) {
                query.resourceType = filters.resourceType;
            }

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await ActivityLog.countDocuments(query);

            // Get logs with pagination
            const logs = await ActivityLog.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy lịch sử hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get activity logs by user
     */
    async getActivityLogsByUser(userId: string, page: number, limit: number): Promise<ActivityLogListResult> {
        try {
            const query = { userId };

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await ActivityLog.countDocuments(query);

            // Get logs with pagination
            const logs = await ActivityLog.find(query)
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
        } catch (error) {
            throw new Error(`Lỗi khi lấy lịch sử hoạt động của người dùng: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Cleanup old activity logs
     */
    async cleanupActivityLogs(days: number): Promise<number> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const result = await ActivityLog.deleteMany({ createdAt: { $lt: cutoffDate } });
            return result.deletedCount || 0;
        } catch (error) {
            throw new Error(`Lỗi khi dọn dẹp log cũ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const userService = new UserService();
