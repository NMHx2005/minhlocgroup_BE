import { Router } from 'express';
import {
    getCompanyInfo,
    createOrUpdateCompanyInfo,
    deleteCompanyInfo,
    updateCompanyInfoSortOrder
} from '@/controllers/admin/companyController';
import { authMiddleware } from '@/middleware/auth';
import { adminMiddleware } from '@/middleware/admin';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Company info routes
router.get('/info', getCompanyInfo);
router.post('/info', createOrUpdateCompanyInfo);
router.delete('/info/:id', deleteCompanyInfo);
router.put('/info/sort', updateCompanyInfoSortOrder);

export default router;
