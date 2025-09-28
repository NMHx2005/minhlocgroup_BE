import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { productService } from '@/services/client/productService';

/**
 * Get all active products for client
 * GET /api/v1/client/ginseng-products
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search, category, grade, minPrice, maxPrice } = req.query;

        const filters = {
            ...(search && { search: search as string }),
            ...(category && { category: category as string }),
            ...(grade && { grade: grade as string }),
            ...(minPrice && { minPrice: parseInt(minPrice as string) }),
            ...(maxPrice && { maxPrice: parseInt(maxPrice as string) })
        };

        const result = await productService.getProducts(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get product by ID for client
 * GET /api/v1/client/ginseng-products/:id
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id as string);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });;

            return;
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get product by slug for client
 * GET /api/v1/client/ginseng-products/slug/:slug
 */
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const product = await productService.getProductBySlug(slug as string);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });;

            return;
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get featured products
 * GET /api/v1/client/ginseng-products/featured
 */
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { limit = 8 } = req.query;
        const products = await productService.getFeaturedProducts(parseInt(limit as string));

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm nổi bật',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get products by category
 * GET /api/v1/client/ginseng-products/category/:categoryId
 */
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await productService.getProductsByCategory(
            categoryId as string,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm theo danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get products by origin
 * GET /api/v1/client/ginseng-products/origin/:originId
 */
export const getProductsByOrigin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { originId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await productService.getProductsByOrigin(
            originId as string,
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm theo xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Search products
 * GET /api/v1/client/ginseng-products/search
 */
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, category, grade, minPrice, maxPrice, inStock } = req.query;

        const searchParams = {
            query: q as string,
            category: category as string,
            grade: grade as string,
            minPrice: minPrice ? parseInt(minPrice as string) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
            inStock: inStock === 'true'
        };

        const products = await productService.searchProducts(searchParams as any);

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get product categories
 * GET /api/v1/client/ginseng-categories
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await productService.getCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};

/**
 * Get product origins
 * GET /api/v1/client/ginseng-origins
 */
export const getOrigins = async (req: Request, res: Response): Promise<void> => {
    try {
        const origins = await productService.getOrigins();
        res.json({
            success: true,
            data: origins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });;

        return;
    }
};
