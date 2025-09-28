import mongoose, { Document, Schema } from 'mongoose';

export interface IGinsengCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: mongoose.Types.ObjectId;
    sortOrder: number;
    isActive: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const GinsengCategorySchema = new Schema<IGinsengCategory>({
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
        maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
    },
    image: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
            'URL hình ảnh không hợp lệ'
        ]
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'GinsengCategory',
        default: null
    },
    sortOrder: {
        type: Number,
        default: 0,
        min: [0, 'Thứ tự sắp xếp không được âm']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metaTitle: {
        type: String,
        trim: true,
        maxlength: [60, 'Meta title không được quá 60 ký tự']
    },
    metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'Meta description không được quá 160 ký tự']
    },
    metaKeywords: [{
        type: String,
        trim: true,
        maxlength: [50, 'Mỗi từ khóa không được quá 50 ký tự']
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// Note: slug index is automatically created by unique: true
GinsengCategorySchema.index({ parentId: 1 });
GinsengCategorySchema.index({ isActive: 1 });
GinsengCategorySchema.index({ sortOrder: 1 });

// Compound indexes
GinsengCategorySchema.index({ parentId: 1, isActive: 1 });
GinsengCategorySchema.index({ isActive: 1, sortOrder: 1 });

// Virtual for product count
GinsengCategorySchema.virtual('productCount', {
    ref: 'GinsengProduct',
    localField: '_id',
    foreignField: 'categoryId',
    count: true
});

// Virtual for child categories
GinsengCategorySchema.virtual('childCategories', {
    ref: 'GinsengCategory',
    localField: '_id',
    foreignField: 'parentId'
});

// Virtual for parent category
GinsengCategorySchema.virtual('parentCategory', {
    ref: 'GinsengCategory',
    localField: 'parentId',
    foreignField: '_id',
    justOne: true
});

// Virtual for full path
GinsengCategorySchema.virtual('fullPath').get(function (this: any) {
    if (this.parentCategory) {
        return `${this.parentCategory.name} > ${this.name}`;
    }
    return this.name;
});

// Pre-save middleware to generate slug
GinsengCategorySchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

// Pre-save middleware to set meta fields
GinsengCategorySchema.pre('save', function (next) {
    if (!this.metaTitle) {
        this.metaTitle = this.name;
    }
    if (!this.metaDescription && this.description) {
        this.metaDescription = this.description.substring(0, 160);
    }
    next();
});

// Static methods
GinsengCategorySchema.statics.findActiveCategories = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

GinsengCategorySchema.statics.findRootCategories = function () {
    return this.find({
        parentId: null,
        isActive: true
    }).sort({ sortOrder: 1, name: 1 });
};

GinsengCategorySchema.statics.findChildCategories = function (parentId: string) {
    return this.find({
        parentId,
        isActive: true
    }).sort({ sortOrder: 1, name: 1 });
};

GinsengCategorySchema.statics.findBySlug = function (slug: string) {
    return this.findOne({ slug, isActive: true });
};

GinsengCategorySchema.statics.getCategoryTree = async function () {
    const categories = await this.find({ isActive: true })
        .populate('parentCategory', 'name slug')
        .sort({ sortOrder: 1, name: 1 });

    const tree: any[] = [];
    const categoryMap = new Map();

    categories.forEach((cat: any) => {
        categoryMap.set(cat._id.toString(), {
            ...cat.toObject(),
            children: []
        });
    });

    categories.forEach((cat: any) => {
        if (cat.parentId) {
            const parent = categoryMap.get(cat.parentId.toString());
            if (parent) {
                parent.children.push(categoryMap.get(cat._id.toString()));
            }
        } else {
            tree.push(categoryMap.get(cat._id.toString()));
        }
    });

    return tree;
};

const GinsengCategory = mongoose.model<IGinsengCategory>('GinsengCategory', GinsengCategorySchema);

export default GinsengCategory;
