import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getOrigins,
    createOrigin,
    updateOrigin,
    deleteOrigin
} from '../../controllers/admin/productController';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Category routes - Must come before /:id route
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Origin routes - Must come before /:id route
router.get('/origins', getOrigins);
router.post('/origins', createOrigin);
router.put('/origins/:id', updateOrigin);
router.delete('/origins/:id', deleteOrigin);

// Product routes - /:id route must come last to avoid conflicts
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
