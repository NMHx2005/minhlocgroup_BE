import { Router } from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    uploadGalleryImages,
    deleteGalleryImage,
    addGalleryImageUrl,
    getProjectTypes
} from '../../controllers/admin/projectController';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';
import { upload } from '../../middleware/upload';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Project routes
router.get('/', getProjects);
router.get('/types', getProjectTypes);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Gallery routes
router.post('/:id/gallery', upload.array('images', 10), uploadGalleryImages);
router.post('/:id/gallery/url', addGalleryImageUrl);
router.delete('/:id/gallery/:imageId', deleteGalleryImage);

export default router;
