import { BusinessField } from '@/models/core';
import { Types } from 'mongoose';

export const businessFieldService = {
    /**
     * Get business fields with pagination and filters
     */
    async getBusinessFields(options: {
        page: number;
        limit: number;
        search?: string;
        isActive?: boolean;
        isFeatured?: boolean;
    }) {
        try {
            const { page, limit, search, isActive, isFeatured } = options;
            const skip = (page - 1) * limit;

            // Build filter query
            const filter: any = {};
            if (isActive !== undefined) filter.isActive = isActive;
            if (isFeatured !== undefined) filter.isFeatured = isFeatured;
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const fields = await BusinessField.find(filter)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort({ sortOrder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await BusinessField.countDocuments(filter);

            return {
                fields,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Get business field by ID
     */
    async getBusinessFieldById(id: string) {
        try {
            const field = await BusinessField.findById(id)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email');

            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            return field;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Create new business field
     */
    async createBusinessField(data: any, userId: string) {
        try {
            const field = new BusinessField({
                ...data,
                createdBy: new Types.ObjectId(userId),
                updatedBy: new Types.ObjectId(userId)
            });
            await field.save();
            return field;
        } catch (error) {
            throw new Error(`Lỗi khi tạo lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Update business field
     */
    async updateBusinessField(id: string, data: any, userId: string) {
        try {
            const field = await BusinessField.findByIdAndUpdate(
                id,
                {
                    ...data,
                    updatedBy: new Types.ObjectId(userId)
                },
                { new: true }
            );

            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            return field;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Delete business field
     */
    async deleteBusinessField(id: string) {
        try {
            const field = await BusinessField.findByIdAndDelete(id);
            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            return field;
        } catch (error) {
            throw new Error(`Lỗi khi xóa lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Update business field sort order
     */
    async updateBusinessFieldSortOrder(fields: Array<{ id: string; sortOrder: number }>) {
        try {
            const updatePromises = fields.map(field =>
                BusinessField.findByIdAndUpdate(field.id, { sortOrder: field.sortOrder })
            );
            await Promise.all(updatePromises);
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật thứ tự: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Toggle business field status
     */
    async toggleBusinessFieldStatus(id: string) {
        try {
            const field = await BusinessField.findById(id);
            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }

            field.isActive = !field.isActive;
            await field.save();
            return field;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật trạng thái: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
