import { Router } from 'express';
import {
    getAnalyticsOverview,
    getPageViewsAnalytics,
    getUniqueVisitorsAnalytics,
    getBounceRateAnalytics,
    getSessionDurationAnalytics,
    getTopPagesAnalytics,
    getTrafficSourcesAnalytics,
    getDeviceAnalytics,
    getLocationAnalytics,
    getRealTimeAnalytics,
    trackPageView,
    getCustomAnalytics
} from '../../controllers/shared/analyticsController';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';

const router = Router();

// Analytics routes (require authentication and admin access)
router.use(authMiddleware);
router.use(adminMiddleware);

// Analytics overview and reports
router.get('/overview', getAnalyticsOverview);
router.get('/page-views', getPageViewsAnalytics);
router.get('/unique-visitors', getUniqueVisitorsAnalytics);
router.get('/bounce-rate', getBounceRateAnalytics);
router.get('/session-duration', getSessionDurationAnalytics);
router.get('/top-pages', getTopPagesAnalytics);
router.get('/traffic-sources', getTrafficSourcesAnalytics);
router.get('/devices', getDeviceAnalytics);
router.get('/locations', getLocationAnalytics);
router.get('/real-time', getRealTimeAnalytics);
router.get('/custom', getCustomAnalytics);

// Tracking routes (no admin required for tracking)
router.post('/track', trackPageView);

export default router;
