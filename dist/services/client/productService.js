"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const core_1 = require("@/models/core");
class ProductService {
    async getProducts(page, limit, filters) {
        try {
            const query = {
                isActive: true,
                status: 'active'
            };
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
            const skip = (page - 1) * limit;
            const total = await core_1.GinsengProduct.countDocuments(query);
            const products = await core_1.GinsengProduct.find(query)
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProductById(id) {
        try {
            const product = await core_1.GinsengProduct.findOne({
                _id: id,
                isActive: true,
                status: 'active'
            })
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .lean();
            return product;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProductBySlug(slug) {
        try {
            const product = await core_1.GinsengProduct.findOne({
                slug,
                isActive: true,
                status: 'active'
            })
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .lean();
            return product;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getFeaturedProducts(limit = 8) {
        try {
            const products = await core_1.GinsengProduct.find({
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm nổi bật: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProductsByCategory(categoryId, page, limit) {
        try {
            const query = {
                categoryId,
                isActive: true,
                status: 'active'
            };
            const skip = (page - 1) * limit;
            const total = await core_1.GinsengProduct.countDocuments(query);
            const products = await core_1.GinsengProduct.find(query)
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm theo danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProductsByOrigin(originId, page, limit) {
        try {
            const query = {
                originId,
                isActive: true,
                status: 'active'
            };
            const skip = (page - 1) * limit;
            const total = await core_1.GinsengProduct.countDocuments(query);
            const products = await core_1.GinsengProduct.find(query)
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm theo xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async searchProducts(searchParams) {
        try {
            const query = {
                isActive: true,
                status: 'active'
            };
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
            const products = await core_1.GinsengProduct.find(query)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .select('-createdBy -updatedBy -__v')
                .sort({ isFeatured: -1, createdAt: -1 })
                .lean();
            return products;
        }
        catch (error) {
            throw new Error(`Lỗi khi tìm kiếm sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getCategories() {
        try {
            const categories = await core_1.GinsengCategory.find({ isActive: true })
                .sort({ sortOrder: 1, name: 1 })
                .lean();
            return categories;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getOrigins() {
        try {
            const origins = await core_1.GinsengOrigin.find({ isActive: true })
                .sort({ name: 1 })
                .lean();
            return origins;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.productService = new ProductService();
