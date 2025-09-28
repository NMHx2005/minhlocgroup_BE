import { GinsengProduct, GinsengCategory, GinsengOrigin } from '@/models/core';

export interface ProductFilters {
    search?: string;
    category?: string;
    grade?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface ProductListResult {
    products: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ProductSearchParams {
    query?: string;
    category?: string;
    grade?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}

class ProductService {
    /**
     * Get all active products for client
     */
    async getProducts(page: number, limit: number, filters: ProductFilters): Promise<ProductListResult> {
        try {
            const query: any = {
                isActive: true,
                status: 'active'
            };

            // Apply filters
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { tags: { $in: [new RegExp(filters.search, 'i')] } }
                ];
            }

            if (filters.category) {
                query.categoryId = filters.category;
            }

            if (filters.grade) {
                query.grade = filters.grade;
            }

            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                query.price = {};
                if (filters.minPrice !== undefined) {
                    query.price.$gte = filters.minPrice;
                }
                if (filters.maxPrice !== undefined) {
                    query.price.$lte = filters.maxPrice;
                }
            }

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await GinsengProduct.countDocuments(query);

            // Get products with pagination
            const products = await GinsengProduct.find(query)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get product by ID for client
     */
    async getProductById(id: string): Promise<any> {
        try {
            const product = await GinsengProduct.findOne({
                _id: id,
                isActive: true,
                status: 'active'
            })
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .lean();

            return product;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get product by slug for client
     */
    async getProductBySlug(slug: string): Promise<any> {
        try {
            const product = await GinsengProduct.findOne({
                slug,
                isActive: true,
                status: 'active'
            })
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .lean();

            return product;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get featured products
     */
    async getFeaturedProducts(limit: number = 8): Promise<any[]> {
        try {
            const products = await GinsengProduct.find({
                isActive: true,
                isFeatured: true,
                status: 'active',
                stock: { $gt: 0 }
            })
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();

            return products;
        } catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm nổi bật: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get products by category
     */
    async getProductsByCategory(categoryId: string, page: number, limit: number): Promise<ProductListResult> {
        try {
            const query = {
                categoryId,
                isActive: true,
                status: 'active'
            };

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await GinsengProduct.countDocuments(query);

            // Get products with pagination
            const products = await GinsengProduct.find(query)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm theo danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get products by origin
     */
    async getProductsByOrigin(originId: string, page: number, limit: number): Promise<ProductListResult> {
        try {
            const query = {
                originId,
                isActive: true,
                status: 'active'
            };

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await GinsengProduct.countDocuments(query);

            // Get products with pagination
            const products = await GinsengProduct.find(query)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm theo xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Search products
     */
    async searchProducts(searchParams: ProductSearchParams): Promise<any[]> {
        try {
            const query: any = {
                isActive: true,
                status: 'active'
            };

            // Apply search filters
            if (searchParams.query) {
                query.$or = [
                    { name: { $regex: searchParams.query, $options: 'i' } },
                    { description: { $regex: searchParams.query, $options: 'i' } },
                    { tags: { $in: [new RegExp(searchParams.query, 'i')] } }
                ];
            }

            if (searchParams.category) {
                query.categoryId = searchParams.category;
            }

            if (searchParams.grade) {
                query.grade = searchParams.grade;
            }

            if (searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined) {
                query.price = {};
                if (searchParams.minPrice !== undefined) {
                    query.price.$gte = searchParams.minPrice;
                }
                if (searchParams.maxPrice !== undefined) {
                    query.price.$lte = searchParams.maxPrice;
                }
            }

            if (searchParams.inStock) {
                query.stock = { $gt: 0 };
            }

            const products = await GinsengProduct.find(query)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .sort({ isFeatured: -1, createdAt: -1 })
                .lean();

            return products;
        } catch (error) {
            throw new Error(`Lỗi khi tìm kiếm sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get product categories
     */
    async getCategories(): Promise<any[]> {
        try {
            const categories = await GinsengCategory.find({ isActive: true })
                .sort({ sortOrder: 1, name: 1 })
                .lean();

            return categories;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get product origins
     */
    async getOrigins(): Promise<any[]> {
        try {
            const origins = await GinsengOrigin.find({ isActive: true })
                .sort({ name: 1 })
                .lean();

            return origins;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const productService = new ProductService();
