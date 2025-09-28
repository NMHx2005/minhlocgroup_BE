"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsCategoryService = void 0;
const NewsCategory_1 = __importDefault(require("../../models/core/NewsCategory"));
exports.newsCategoryService = {
    async getCategories() {
        try {
            return await NewsCategory_1.default.find().sort({ sortOrder: 1, name: 1 });
        }
        catch (error) {
            console.error('Error fetching news categories:', error);
            throw new Error('Lỗi khi tải danh mục tin tức');
        }
    },
    async getActiveCategories() {
        try {
            return await NewsCategory_1.default.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
        }
        catch (error) {
            console.error('Error fetching active news categories:', error);
            throw new Error('Lỗi khi tải danh mục tin tức hoạt động');
        }
    },
    async getCategoryById(id) {
        try {
            return await NewsCategory_1.default.findById(id);
        }
        catch (error) {
            console.error('Error fetching news category by ID:', error);
            throw new Error('Lỗi khi tải danh mục tin tức');
        }
    },
    async getCategoryBySlug(slug) {
        try {
            return await NewsCategory_1.default.findOne({ slug, isActive: true });
        }
        catch (error) {
            console.error('Error fetching news category by slug:', error);
            throw new Error('Lỗi khi tải danh mục tin tức');
        }
    },
    async createCategory(data) {
        try {
            const category = new NewsCategory_1.default(data);
            return await category.save();
        }
        catch (error) {
            console.error('Error creating news category:', error);
            if (error.code === 11000) {
                throw new Error('Slug danh mục đã tồn tại');
            }
            throw new Error(error.message || 'Lỗi khi tạo danh mục tin tức');
        }
    },
    async updateCategory(id, data) {
        try {
            return await NewsCategory_1.default.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true, runValidators: true });
        }
        catch (error) {
            console.error('Error updating news category:', error);
            if (error.code === 11000) {
                throw new Error('Slug danh mục đã tồn tại');
            }
            throw new Error(error.message || 'Lỗi khi cập nhật danh mục tin tức');
        }
    },
    async deleteCategory(id) {
        try {
            const result = await NewsCategory_1.default.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            console.error('Error deleting news category:', error);
            throw new Error('Lỗi khi xóa danh mục tin tức');
        }
    },
    async getCategoryStats() {
        try {
            return await NewsCategory_1.default.aggregate([
                {
                    $lookup: {
                        from: 'newsarticles',
                        localField: '_id',
                        foreignField: 'categoryId',
                        as: 'articles'
                    }
                },
                {
                    $project: {
                        name: 1,
                        slug: 1,
                        color: 1,
                        articleCount: { $size: '$articles' },
                        publishedCount: {
                            $size: {
                                $filter: {
                                    input: '$articles',
                                    cond: { $eq: ['$$this.status', 'published'] }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: { sortOrder: 1, name: 1 }
                }
            ]);
        }
        catch (error) {
            console.error('Error fetching category statistics:', error);
            throw new Error('Lỗi khi tải thống kê danh mục');
        }
    },
    async toggleCategoryStatus(id) {
        try {
            const category = await NewsCategory_1.default.findById(id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }
            category.isActive = !category.isActive;
            return await category.save();
        }
        catch (error) {
            console.error('Error toggling category status:', error);
            throw new Error(error.message || 'Lỗi khi thay đổi trạng thái danh mục');
        }
    },
    async updateSortOrder(categories) {
        try {
            const bulkOps = categories.map(cat => ({
                updateOne: {
                    filter: { _id: cat.id },
                    update: { sortOrder: cat.sortOrder }
                }
            }));
            await NewsCategory_1.default.bulkWrite(bulkOps);
        }
        catch (error) {
            console.error('Error updating sort order:', error);
            throw new Error('Lỗi khi cập nhật thứ tự sắp xếp');
        }
    }
};
exports.default = exports.newsCategoryService;
