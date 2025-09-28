import { Router } from 'express';
import {
    getJobPositions,
    getJobPositionBySlug,
    getJobPositionById,
    submitJobApplication,
    getDepartments
} from '../../controllers/client/careersController';
import { contactLimiter } from '../../middleware/rateLimit';
import { checkDatabaseConnection } from '../../middleware/database';

const router = Router();

// Public careers routes
router.get('/', checkDatabaseConnection, getJobPositions);
router.get('/departments', getDepartments);
router.get('/id/:id', checkDatabaseConnection, getJobPositionById);
router.get('/:slug', checkDatabaseConnection, getJobPositionBySlug);
router.post('/apply', contactLimiter, checkDatabaseConnection, submitJobApplication);

export default router;
