import express from 'express';
import {
    getNewsCategories,
    getActiveNewsCategories,
    getNewsCategoryById,
    createNewsCategory,
    updateNewsCategory,
    deleteNewsCategory,
    getCategoryStats,
    toggleCategoryStatus,
    updateSortOrder
} from '../../controllers/admin/newsCategoryController';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';
import { validateNewsCategory, validateCreateNewsCategory } from '../../middleware/validation';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/v1/admin/news-categories - Get all categories
router.get('/', getNewsCategories);

// GET /api/v1/admin/news-categories/active - Get active categories
router.get('/active', getActiveNewsCategories);

// GET /api/v1/admin/news-categories/stats - Get category statistics
router.get('/stats', getCategoryStats);

// GET /api/v1/admin/news-categories/:id - Get category by ID
router.get('/:id', getNewsCategoryById);

// POST /api/v1/admin/news-categories - Create new category
router.post('/', validateCreateNewsCategory, createNewsCategory);

// PUT /api/v1/admin/news-categories/:id - Update category
router.put('/:id', validateNewsCategory, updateNewsCategory);

// PATCH /api/v1/admin/news-categories/:id/toggle-status - Toggle category status
router.patch('/:id/toggle-status', toggleCategoryStatus);

// PUT /api/v1/admin/news-categories/sort-order - Update sort order
router.put('/sort-order', updateSortOrder);

// DELETE /api/v1/admin/news-categories/:id - Delete category
router.delete('/:id', deleteNewsCategory);

export default router;
