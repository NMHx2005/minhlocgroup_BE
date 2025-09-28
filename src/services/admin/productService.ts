import { GinsengProduct, GinsengCategory, GinsengOrigin } from '@/models/core';

export interface ProductFilters {
    search?: string;
    category?: string;
    grade?: string;
    status?: string;
    origin?: string;
    priceMin?: number;
    priceMax?: number;
    weightMin?: number;
    weightMax?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
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

class ProductService {
    /**
     * Get all products with pagination and filters
     */
    async getProducts(page: number, limit: number, filters: ProductFilters): Promise<ProductListResult> {
        try {
            const query: any = {};

            // Apply filters
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { sku: { $regex: filters.search, $options: 'i' } }
                ];
            }

            if (filters.category && filters.category !== 'all' && filters.category !== 'categories') {
                // Validate that category is a valid ObjectId
                if (filters.category.match(/^[0-9a-fA-F]{24}$/)) {
                    query.categoryId = filters.category;
                }
                // Skip invalid category filters to avoid ObjectId cast errors
            }

            if (filters.grade && filters.grade !== 'all') {
                query.grade = filters.grade;
            }

            if (filters.status && filters.status !== 'all') {
                query.status = filters.status;
            }

            if (filters.origin && filters.origin !== 'all' && filters.origin !== 'origins') {
                // Validate that origin is a valid ObjectId
                if (filters.origin.match(/^[0-9a-fA-F]{24}$/)) {
                    query.originId = filters.origin;
                }
                // Skip invalid origin filters to avoid ObjectId cast errors
            }

            // Price range filter
            if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
                query.price = {};
                if (filters.priceMin !== undefined) {
                    query.price.$gte = filters.priceMin;
                }
                if (filters.priceMax !== undefined) {
                    query.price.$lte = filters.priceMax;
                }
            }

            // Weight range filter
            if (filters.weightMin !== undefined || filters.weightMax !== undefined) {
                query.weight = {};
                if (filters.weightMin !== undefined) {
                    query.weight.$gte = filters.weightMin;
                }
                if (filters.weightMax !== undefined) {
                    query.weight.$lte = filters.weightMax;
                }
            }

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await GinsengProduct.countDocuments(query);

            // Build sort object
            const sortField = filters.sortBy || 'createdAt';
            const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
            const sortObj: any = {};
            sortObj[sortField] = sortOrder;

            // Get products with pagination
            const products = await GinsengProduct.find(query)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort(sortObj)
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
     * Get product by ID
     */
    async getProductById(id: string): Promise<any> {
        try {
            const product = await GinsengProduct.findById(id)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .lean();

            return product;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create new product
     */
    async createProduct(productData: any): Promise<any> {
        try {
            // Generate slug from name
            const slug = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();

            const product = new GinsengProduct({
                ...productData,
                slug
            });
            await product.save();

            return await GinsengProduct.findById(product._id)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .populate('createdBy', 'name email')
                .lean();
        } catch (error) {
            throw new Error(`Lỗi khi tạo sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update product
     */
    async updateProduct(id: string, updateData: any): Promise<any> {
        try {
            const product = await GinsengProduct.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .lean();

            return product;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete product
     */
    async deleteProduct(id: string): Promise<boolean> {
        try {
            const result = await GinsengProduct.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get categories
     */
    async getCategories(): Promise<any[]> {
        try {
            const categories = await GinsengCategory.find({ isActive: true })
                .select('-__v')
                .sort({ sortOrder: 1, name: 1 })
                .lean();

            // Manually count products for each category to avoid virtual field issues
            const categoriesWithCount = await Promise.all(
                categories.map(async (category) => {
                    const productCount = await GinsengProduct.countDocuments({
                        categoryId: category._id,
                        isActive: true
                    });
                    return {
                        ...category,
                        productCount
                    };
                })
            );

            return categoriesWithCount;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create category
     */
    async createCategory(categoryData: any): Promise<any> {
        try {
            const category = new GinsengCategory(categoryData);
            await category.save();

            return category;
        } catch (error) {
            throw new Error(`Lỗi khi tạo danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update category
     */
    async updateCategory(id: string, updateData: any): Promise<any> {
        try {
            const category = await GinsengCategory.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).lean();

            return category;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete category
     */
    async deleteCategory(id: string): Promise<boolean> {
        try {
            // Check if category has products
            const productCount = await GinsengProduct.countDocuments({ categoryId: id });
            if (productCount > 0) {
                throw new Error('Không thể xóa danh mục có sản phẩm');
            }

            const result = await GinsengCategory.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get origins
     */
    async getOrigins(): Promise<any[]> {
        try {
            const origins = await GinsengOrigin.find({ isActive: true })
                .select('-__v')
                .sort({ name: 1 })
                .lean();

            // Manually count products for each origin to avoid virtual field issues
            const originsWithCount = await Promise.all(
                origins.map(async (origin) => {
                    const productCount = await GinsengProduct.countDocuments({
                        originId: origin._id,
                        isActive: true
                    });
                    return {
                        ...origin,
                        productCount
                    };
                })
            );

            return originsWithCount;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Create origin
     */
    async createOrigin(originData: any): Promise<any> {
        try {
            const origin = new GinsengOrigin(originData);
            await origin.save();

            return origin;
        } catch (error) {
            throw new Error(`Lỗi khi tạo xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update origin
     */
    async updateOrigin(id: string, updateData: any): Promise<any> {
        try {
            const origin = await GinsengOrigin.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).lean();

            return origin;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete origin
     */
    async deleteOrigin(id: string): Promise<boolean> {
        try {
            // Check if origin has products
            const productCount = await GinsengProduct.countDocuments({ originId: id });
            if (productCount > 0) {
                throw new Error('Không thể xóa xuất xứ có sản phẩm');
            }

            const result = await GinsengOrigin.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const productService = new ProductService();
