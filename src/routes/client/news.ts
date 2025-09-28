import { Router } from 'express';
import {
    getNews,
    getNewsById,
    getNewsBySlug,
    getFeaturedNews,
    getLatestNews,
    getNewsByCategory,
    searchNews,
    getNewsCategories,
    getNewsTags,
    getRelatedNews
} from '@/controllers/client/newsController';

const router = Router();

// News routes (no authentication required for public access)
router.get('/', getNews);
router.get('/featured', getFeaturedNews);
router.get('/latest', getLatestNews);
router.get('/search', searchNews);
router.get('/categories', getNewsCategories);
router.get('/tags', getNewsTags);
router.get('/category/:categoryId', getNewsByCategory);
router.get('/:id', getNewsById);
router.get('/slug/:slug', getNewsBySlug);
router.get('/:id/related', getRelatedNews);

export default router;
