"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const core_1 = require("@/models/core");
class ProductService {
    async getProducts(page, limit, filters) {
        try {
            const query = {};
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { sku: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.category && filters.category !== 'all' && filters.category !== 'categories') {
                if (filters.category.match(/^[0-9a-fA-F]{24}$/)) {
                    query.categoryId = filters.category;
                }
            }
            if (filters.grade && filters.grade !== 'all') {
                query.grade = filters.grade;
            }
            if (filters.status && filters.status !== 'all') {
                query.status = filters.status;
            }
            if (filters.origin && filters.origin !== 'all' && filters.origin !== 'origins') {
                if (filters.origin.match(/^[0-9a-fA-F]{24}$/)) {
                    query.originId = filters.origin;
                }
            }
            if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
                query.price = {};
                if (filters.priceMin !== undefined) {
                    query.price.$gte = filters.priceMin;
                }
                if (filters.priceMax !== undefined) {
                    query.price.$lte = filters.priceMax;
                }
            }
            if (filters.weightMin !== undefined || filters.weightMax !== undefined) {
                query.weight = {};
                if (filters.weightMin !== undefined) {
                    query.weight.$gte = filters.weightMin;
                }
                if (filters.weightMax !== undefined) {
                    query.weight.$lte = filters.weightMax;
                }
            }
            const skip = (page - 1) * limit;
            const total = await core_1.GinsengProduct.countDocuments(query);
            const sortField = filters.sortBy || 'createdAt';
            const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortField] = sortOrder;
            const products = await core_1.GinsengProduct.find(query)
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProductById(id) {
        try {
            const product = await core_1.GinsengProduct.findById(id)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .lean();
            return product;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createProduct(productData) {
        try {
            const slug = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            const product = new core_1.GinsengProduct({
                ...productData,
                slug
            });
            await product.save();
            return await core_1.GinsengProduct.findById(product._id)
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .populate('createdBy', 'name email')
                .lean();
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateProduct(id, updateData) {
        try {
            const product = await core_1.GinsengProduct.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('categoryId', 'name slug')
                .populate('originId', 'name country')
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .lean();
            return product;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteProduct(id) {
        try {
            const result = await core_1.GinsengProduct.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getCategories() {
        try {
            const categories = await core_1.GinsengCategory.find({ isActive: true })
                .select('-__v')
                .sort({ sortOrder: 1, name: 1 })
                .lean();
            const categoriesWithCount = await Promise.all(categories.map(async (category) => {
                const productCount = await core_1.GinsengProduct.countDocuments({
                    categoryId: category._id,
                    isActive: true
                });
                return {
                    ...category,
                    productCount
                };
            }));
            return categoriesWithCount;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createCategory(categoryData) {
        try {
            const category = new core_1.GinsengCategory(categoryData);
            await category.save();
            return category;
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateCategory(id, updateData) {
        try {
            const category = await core_1.GinsengCategory.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
            return category;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteCategory(id) {
        try {
            const productCount = await core_1.GinsengProduct.countDocuments({ categoryId: id });
            if (productCount > 0) {
                throw new Error('Không thể xóa danh mục có sản phẩm');
            }
            const result = await core_1.GinsengCategory.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getOrigins() {
        try {
            const origins = await core_1.GinsengOrigin.find({ isActive: true })
                .select('-__v')
                .sort({ name: 1 })
                .lean();
            const originsWithCount = await Promise.all(origins.map(async (origin) => {
                const productCount = await core_1.GinsengProduct.countDocuments({
                    originId: origin._id,
                    isActive: true
                });
                return {
                    ...origin,
                    productCount
                };
            }));
            return originsWithCount;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createOrigin(originData) {
        try {
            const origin = new core_1.GinsengOrigin(originData);
            await origin.save();
            return origin;
        }
        catch (error) {
            throw new Error(`Lỗi khi tạo xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateOrigin(id, updateData) {
        try {
            const origin = await core_1.GinsengOrigin.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
            return origin;
        }
        catch (error) {
            throw new Error(`Lỗi khi cập nhật xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteOrigin(id) {
        try {
            const productCount = await core_1.GinsengProduct.countDocuments({ originId: id });
            if (productCount > 0) {
                throw new Error('Không thể xóa xuất xứ có sản phẩm');
            }
            const result = await core_1.GinsengOrigin.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa xuất xứ: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.productService = new ProductService();
