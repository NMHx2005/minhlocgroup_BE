import { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getPermissions,
    assignUserRoles,
    getActivityLogs,
    getActivityLogsByUser,
    cleanupActivityLogs
} from '../../controllers/admin/userController';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// User routes
router.get('/', getUsers);
router.post('/', createUser);

// Role routes
router.get('/roles', getRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

// Permission routes
router.get('/permissions', getPermissions);

// Activity log routes (must be before /:id routes)
router.get('/activity-logs', getActivityLogs);
router.get('/activity-logs/:userId', getActivityLogsByUser);
router.delete('/activity-logs/cleanup', cleanupActivityLogs);

// User-specific routes (must be after specific routes)
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/roles', assignUserRoles);

export default router;
