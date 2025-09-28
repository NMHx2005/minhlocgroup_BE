import mongoose, { Document, Schema } from 'mongoose';

export interface INewsCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    color: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const NewsCategorySchema = new Schema<INewsCategory>({
    name: {
        type: String,
        required: [true, 'Tên danh mục là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên danh mục phải có ít nhất 2 ký tự'],
        maxlength: [100, 'Tên danh mục không được quá 100 ký tự']
    },
    slug: {
        type: String,
        required: [true, 'Slug là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang'
        ]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },
    color: {
        type: String,
        required: [true, 'Màu sắc là bắt buộc'],
        trim: true,
        match: [/^#[0-9A-Fa-f]{6}$/, 'Màu sắc phải là mã hex hợp lệ'],
        default: '#1976d2'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0,
        min: [0, 'Thứ tự sắp xếp không được âm']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
NewsCategorySchema.index({ name: 'text', description: 'text' });
NewsCategorySchema.index({ slug: 1 });
NewsCategorySchema.index({ isActive: 1 });
NewsCategorySchema.index({ sortOrder: 1 });

// Virtual for URL
NewsCategorySchema.virtual('url').get(function () {
    return `/news/category/${this.slug}`;
});

// Pre-save middleware to generate slug from name
NewsCategorySchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();
    }
    next();
});

// Static method to find active categories
NewsCategorySchema.statics.findActiveCategories = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Static method to find by slug
NewsCategorySchema.statics.findBySlug = function (slug: string) {
    return this.findOne({ slug, isActive: true });
};

// Static method to get category statistics
NewsCategorySchema.statics.getCategoryStats = function () {
    return this.aggregate([
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
};

// Export the model
const NewsCategory = mongoose.model<INewsCategory>('NewsCategory', NewsCategorySchema);

export default NewsCategory;