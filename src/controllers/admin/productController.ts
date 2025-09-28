import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { productService } from '../../services/admin/productService';

/**
 * Get all ginseng products with pagination and filters
 * GET /api/v1/admin/products
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            category,
            grade,
            status,
            origin,
            priceMin,
            priceMax,
            weightMin,
            weightMax,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const filters: any = {
            search: search as string,
            category: category as string,
            grade: grade as string,
            status: status as string,
            origin: origin as string,
            priceMin: priceMin ? parseInt(priceMin as string) : undefined,
            priceMax: priceMax ? parseInt(priceMax as string) : undefined,
            weightMin: weightMin ? parseInt(weightMin as string) : undefined,
            weightMax: weightMax ? parseInt(weightMax as string) : undefined,
            sortBy: sortBy as string,
            sortOrder: sortOrder as 'asc' | 'desc'
        };

        const result = await productService.getProducts(
            parseInt(page as string),
            parseInt(limit as string),
            filters
        );

        res.json({
            success: true,
            data: {
                products: result.products,
                total: result.pagination.total
            },
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get product by ID
 * GET /api/v1/admin/products/:id
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id as string);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
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
        });
        return;
    }
};

/**
 * Create new product
 * POST /api/v1/admin/products
 */
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const productData = {
            ...req.body,
            createdBy: req.user?.id,
            updatedBy: req.user?.id
        };

        const product = await productService.createProduct(productData);
        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update product
 * PUT /api/v1/admin/products/:id
 */
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const productData = {
            ...req.body,
            updatedBy: req.user?.id
        };

        const product = await productService.updateProduct(id as string, productData);
        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete product
 * DELETE /api/v1/admin/products/:id
 */
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id as string);
        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get all categories
 * GET /api/v1/admin/products/categories
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
            message: 'Lỗi khi lấy danh sách phân loại',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Create new category
 * POST /api/v1/admin/products/categories
 */
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const categoryData = {
            ...req.body,
            createdBy: req.user?.id,
            updatedBy: req.user?.id
        };

        const category = await productService.createCategory(categoryData);
        res.status(201).json({
            success: true,
            message: 'Tạo phân loại thành công',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo phân loại',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update category
 * PUT /api/v1/admin/products/categories/:id
 */
export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const categoryData = {
            ...req.body,
            updatedBy: req.user?.id
        };

        const category = await productService.updateCategory(id as string, categoryData);
        res.json({
            success: true,
            message: 'Cập nhật phân loại thành công',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật phân loại',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete category
 * DELETE /api/v1/admin/products/categories/:id
 */
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await productService.deleteCategory(id as string);
        res.json({
            success: true,
            message: 'Xóa phân loại thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa phân loại',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get all origins
 * GET /api/v1/admin/products/origins
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
        });
        return;
    }
};

/**
 * Create new origin
 * POST /api/v1/admin/products/origins
 */
export const createOrigin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const originData = {
            ...req.body,
            createdBy: req.user?.id,
            updatedBy: req.user?.id
        };

        const origin = await productService.createOrigin(originData);
        res.status(201).json({
            success: true,
            message: 'Tạo xuất xứ thành công',
            data: origin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Update origin
 * PUT /api/v1/admin/products/origins/:id
 */
export const updateOrigin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const originData = {
            ...req.body,
            updatedBy: req.user?.id
        };

        const origin = await productService.updateOrigin(id as string, originData);
        res.json({
            success: true,
            message: 'Cập nhật xuất xứ thành công',
            data: origin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Delete origin
 * DELETE /api/v1/admin/products/origins/:id
 */
export const deleteOrigin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await productService.deleteOrigin(id as string);
        res.json({
            success: true,
            message: 'Xóa xuất xứ thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};