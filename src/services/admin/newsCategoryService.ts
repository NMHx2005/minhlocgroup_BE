import NewsCategory, { INewsCategory } from '../../models/core/NewsCategory';

export interface CreateNewsCategoryData {
    name: string;
    slug?: string;
    description?: string;
    color?: string;
    isActive?: boolean;
    sortOrder?: number;
}

export interface UpdateNewsCategoryData extends Partial<CreateNewsCategoryData> { }

export const newsCategoryService = {
    // Get all categories
    async getCategories(): Promise<INewsCategory[]> {
        try {
            return await NewsCategory.find().sort({ sortOrder: 1, name: 1 });
        } catch (error) {
            console.error('Error fetching news categories:', error);
            throw new Error('Lỗi khi tải danh mục tin tức');
        }
    },

    // Get active categories
    async getActiveCategories(): Promise<INewsCategory[]> {
        try {
            return await NewsCategory.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
        } catch (error) {
            console.error('Error fetching active news categories:', error);
            throw new Error('Lỗi khi tải danh mục tin tức hoạt động');
        }
    },

    // Get category by ID
    async getCategoryById(id: string): Promise<INewsCategory | null> {
        try {
            return await NewsCategory.findById(id);
        } catch (error) {
            console.error('Error fetching news category by ID:', error);
            throw new Error('Lỗi khi tải danh mục tin tức');
        }
    },

    // Get category by slug
    async getCategoryBySlug(slug: string): Promise<INewsCategory | null> {
        try {
            return await NewsCategory.findOne({ slug, isActive: true });
        } catch (error) {
            console.error('Error fetching news category by slug:', error);
            throw new Error('Lỗi khi tải danh mục tin tức');
        }
    },

    // Create new category
    async createCategory(data: CreateNewsCategoryData): Promise<INewsCategory> {
        try {
            const category = new NewsCategory(data);
            return await category.save();
        } catch (error: any) {
            console.error('Error creating news category:', error);
            if (error.code === 11000) {
                throw new Error('Slug danh mục đã tồn tại');
            }
            throw new Error(error.message || 'Lỗi khi tạo danh mục tin tức');
        }
    },

    // Update category
    async updateCategory(id: string, data: UpdateNewsCategoryData): Promise<INewsCategory | null> {
        try {
            return await NewsCategory.findByIdAndUpdate(
                id,
                { ...data, updatedAt: new Date() },
                { new: true, runValidators: true }
            );
        } catch (error: any) {
            console.error('Error updating news category:', error);
            if (error.code === 11000) {
                throw new Error('Slug danh mục đã tồn tại');
            }
            throw new Error(error.message || 'Lỗi khi cập nhật danh mục tin tức');
        }
    },

    // Delete category
    async deleteCategory(id: string): Promise<boolean> {
        try {
            const result = await NewsCategory.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            console.error('Error deleting news category:', error);
            throw new Error('Lỗi khi xóa danh mục tin tức');
        }
    },

    // Get category statistics
    async getCategoryStats(): Promise<any[]> {
        try {
            return await NewsCategory.aggregate([
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
        } catch (error) {
            console.error('Error fetching category statistics:', error);
            throw new Error('Lỗi khi tải thống kê danh mục');
        }
    },

    // Toggle category status
    async toggleCategoryStatus(id: string): Promise<INewsCategory | null> {
        try {
            const category = await NewsCategory.findById(id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }

            category.isActive = !category.isActive;
            return await category.save();
        } catch (error: any) {
            console.error('Error toggling category status:', error);
            throw new Error(error.message || 'Lỗi khi thay đổi trạng thái danh mục');
        }
    },

    // Update sort order
    async updateSortOrder(categories: { id: string; sortOrder: number }[]): Promise<void> {
        try {
            const bulkOps = categories.map(cat => ({
                updateOne: {
                    filter: { _id: cat.id },
                    update: { sortOrder: cat.sortOrder }
                }
            }));

            await NewsCategory.bulkWrite(bulkOps);
        } catch (error) {
            console.error('Error updating sort order:', error);
            throw new Error('Lỗi khi cập nhật thứ tự sắp xếp');
        }
    }
};

export default newsCategoryService;
