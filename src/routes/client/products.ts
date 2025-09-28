import { Router } from 'express';
import {
    getProducts,
    getProductById,
    getProductBySlug,
    getFeaturedProducts,
    getProductsByCategory,
    getProductsByOrigin,
    searchProducts,
    getCategories,
    getOrigins
} from '@/controllers/client/productController';

const router = Router();

// Product routes (no authentication required for public access)
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/origins', getOrigins);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/origin/:originId', getProductsByOrigin);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);

export default router;
