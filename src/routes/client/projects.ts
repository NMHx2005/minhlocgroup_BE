import { Router } from 'express';
import {
    getProjects,
    getProjectById,
    getProjectBySlug,
    getFeaturedProjects,
    getProjectFloorPlans,
    searchProjects,
    getProjectTypes
} from '../../controllers/client/projectController';

const router = Router();

// Project routes (no authentication required for public access)
router.get('/', getProjects);
router.get('/types', getProjectTypes);
router.get('/featured', getFeaturedProjects);
router.get('/search', searchProjects);
router.get('/:id', getProjectById);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id/floor-plans', getProjectFloorPlans);

export default router;
