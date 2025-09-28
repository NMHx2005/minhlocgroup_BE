import { Router } from 'express';
import { getOverview, getRevenueChart, getProjectProgress, getTopPerformers, getRecentActivity } from '@/controllers/admin/dashboardController';
import { authMiddleware } from '@/middleware/auth';
import { adminMiddleware } from '@/middleware/admin';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard routes
router.get('/overview', getOverview);
router.get('/revenue-chart', getRevenueChart);
router.get('/project-progress', getProjectProgress);
router.get('/top-performers', getTopPerformers);
router.get('/recent-activity', getRecentActivity);

export default router;
