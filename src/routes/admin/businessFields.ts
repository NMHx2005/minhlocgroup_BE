import { Router } from 'express';
import {
    getBusinessFields,
    getBusinessFieldById,
    createBusinessField,
    updateBusinessField,
    deleteBusinessField,
    updateBusinessFieldSortOrder,
    toggleBusinessFieldStatus
} from '@/controllers/admin/businessFieldController';
import { authMiddleware } from '@/middleware/auth';
import { adminMiddleware } from '@/middleware/admin';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Business fields routes
router.get('/', getBusinessFields);
router.get('/:id', getBusinessFieldById);
router.post('/', createBusinessField);
router.put('/:id', updateBusinessField);
router.delete('/:id', deleteBusinessField);
router.put('/sort', updateBusinessFieldSortOrder);
router.put('/:id/toggle-status', toggleBusinessFieldStatus);

export default router;
