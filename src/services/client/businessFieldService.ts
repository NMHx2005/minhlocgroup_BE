import { BusinessField } from '@/models/core';

export const businessFieldService = {
    /**
     * Get business fields for public display
     */
    async getBusinessFields(options: {
        search?: string;
        isFeatured?: boolean;
    }) {
        try {
            const { search, isFeatured } = options;

            // Build filter query for active fields
            const filter: any = { isActive: true };
            if (isFeatured) filter.isFeatured = true;
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const fields = await BusinessField.find(filter)
                .sort({ sortOrder: 1, createdAt: -1 });

            return fields;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Get business field by slug for public display
     */
    async getBusinessFieldBySlug(slug: string) {
        try {
            const field = await BusinessField.findBySlug(slug);

            if (!field) {
                throw new Error('Không tìm thấy lĩnh vực hoạt động');
            }
            return field;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin lĩnh vực hoạt động: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
