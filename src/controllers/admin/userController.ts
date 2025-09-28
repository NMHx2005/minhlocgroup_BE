import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { userService } from '../../services/admin/userService';

/**
 * Get all users with pagination and filters
 * GET /api/v1/customers
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, role, status, type } = req.query;

        const filters = {
            search: search as string,
            role: role as string,
            status: status as string,
            type: type as string
        };

        const result = await userService.getUsers(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.users,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get user by ID
 * GET /api/v1/customers/:id
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id as string);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });;

            return;
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Create new user
 * POST /api/v1/customers
 */
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userData = {
            ...req.body,
            createdBy: req.user?.id
        };

        const user = await userService.createUser(userData as string); res.status(201).json({
            success: true,
            message: 'Tạo người dùng thành công',
            data: user
        });;


        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update user
 * PUT /api/v1/customers/:id
 */
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id
        };

        const user = await userService.updateUser(id as string, updateData);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Delete user
 * DELETE /api/v1/customers/:id
 */
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await userService.deleteUser(id as string);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get all roles
 * GET /api/v1/roles
 */
export const getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const roles = await userService.getRoles();
        res.json({
            success: true,
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Create new role
 * POST /api/v1/roles
 */
export const createRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const role = await userService.createRole(req.body); res.status(201).json({
            success: true,
            message: 'Tạo vai trò thành công',
            data: role
        });;


        return;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Update role
 * PUT /api/v1/roles/:id
 */
export const updateRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const role = await userService.updateRole(id as string, req.body);

        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy vai trò'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Cập nhật vai trò thành công',
            data: role
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Delete role
 * DELETE /api/v1/roles/:id
 */
export const deleteRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await userService.deleteRole(id as string);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy vai trò'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Xóa vai trò thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get all permissions
 * GET /api/v1/permissions
 */
export const getPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const permissions = await userService.getPermissions();
        res.json({
            success: true,
            data: permissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách quyền',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Assign roles to user
 * PUT /api/v1/users/:id/roles
 */
export const assignUserRoles = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { roles } = req.body;

        const user = await userService.assignUserRoles(id as string, roles);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });;

            return;
        }

        res.json({
            success: true,
            message: 'Gán vai trò thành công',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi gán vai trò',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get activity logs
 * GET /api/v1/activity-logs
 */
export const getActivityLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, userId, action, resourceType } = req.query;

        const filters = {
            userId: userId as string,
            action: action as string,
            resourceType: resourceType as string
        };

        const result = await userService.getActivityLogs(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.logs,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử hoạt động',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get activity logs by user
 * GET /api/v1/activity-logs/:userId
 */
export const getActivityLogsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await userService.getActivityLogsByUser(
            userId as string,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.json({
            success: true,
            data: result.logs,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử hoạt động của người dùng',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Cleanup old activity logs
 * DELETE /api/v1/activity-logs/cleanup
 */
export const cleanupActivityLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { days = 90 } = req.query;
        const deletedCount = await userService.cleanupActivityLogs(parseInt(days as string));

        res.json({
            success: true,
            message: `Đã xóa ${deletedCount} log cũ`,
            data: { deletedCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi dọn dẹp log cũ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};
