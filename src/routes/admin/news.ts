import { Router } from 'express';
import {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    publishNews,
    getNewsCategories,
    createNewsCategory,
    updateNewsCategory,
    deleteNewsCategory,
    getNewsTags,
    createNewsTag,
    updateNewsTag,
    deleteNewsTag
} from '@/controllers/admin/newsController';
import { authMiddleware } from '@/middleware/auth';
import { adminMiddleware } from '@/middleware/admin';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Category routes (must come before /:id routes)
router.get('/categories', getNewsCategories);
router.post('/categories', createNewsCategory);
router.put('/categories/:id', updateNewsCategory);
router.delete('/categories/:id', deleteNewsCategory);

// Tag routes (must come before /:id routes)
router.get('/tags', getNewsTags);
router.post('/tags', createNewsTag);
router.put('/tags/:id', updateNewsTag);
router.delete('/tags/:id', deleteNewsTag);

// News routes
router.get('/', getNews);
router.get('/:id', getNewsById);
router.post('/', createNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);
router.post('/:id/publish', publishNews);

export default router;
