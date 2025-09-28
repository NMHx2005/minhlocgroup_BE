import { Router } from 'express';
import {
    getJobPositions,
    getJobPositionById,
    createJobPosition,
    updateJobPosition,
    deleteJobPosition,
    getJobApplications,
    getJobApplicationById,
    updateJobApplicationStatus,
    getCareersStatistics,
    getDepartments,
    submitJobApplication
} from '@/controllers/admin/careersController';
import { authMiddleware } from '@/middleware/auth';
import { adminMiddleware } from '@/middleware/admin';
import { contactLimiter } from '@/middleware/rateLimit';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Job positions routes
router.get('/positions', getJobPositions);
router.get('/positions/:id', getJobPositionById);
router.post('/positions', createJobPosition);
router.put('/positions/:id', updateJobPosition);
router.delete('/positions/:id', deleteJobPosition);

// Job applications routes
router.get('/applications', getJobApplications);
router.get('/applications/:id', getJobApplicationById);
router.put('/applications/:id/status', updateJobApplicationStatus);

// Statistics
router.get('/statistics', getCareersStatistics);

// Departments
router.get('/departments', getDepartments);

// Job application
router.post('/apply', contactLimiter, submitJobApplication);

export default router;
