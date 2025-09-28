import mongoose, { Document, Schema } from 'mongoose';

export interface IBusinessField extends Document {
    name: string;
    slug: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    image: string;
    features: string[];
    projects: Array<{
        name: string;
        scale: string;
        status: 'completed' | 'in_progress' | 'planning' | 'sold_out' | 'coming_soon';
        description?: string;
        image?: string;
    }>;
    stats: {
        projects?: string;
        area?: string;
        experience?: string;
        return?: string;
        clients?: string;
        properties?: string;
    };
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BusinessFieldSchema = new Schema<IBusinessField>({
    name: {
        type: String,
        required: [true, 'Tên lĩnh vực là bắt buộc'],
        trim: true,
        minlength: [3, 'Tên lĩnh vực phải có ít nhất 3 ký tự'],
        maxlength: [100, 'Tên lĩnh vực không được quá 100 ký tự']
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
    subtitle: {
        type: String,
        required: [true, 'Phụ đề là bắt buộc'],
        trim: true,
        maxlength: [200, 'Phụ đề không được quá 200 ký tự']
    },
    description: {
        type: String,
        required: [true, 'Mô tả là bắt buộc'],
        minlength: [100, 'Mô tả phải có ít nhất 100 ký tự'],
        maxlength: [2000, 'Mô tả không được quá 2000 ký tự']
    },
    icon: {
        type: String,
        required: [true, 'Icon là bắt buộc'],
        trim: true,
        maxlength: [50, 'Icon không được quá 50 ký tự']
    },
    color: {
        type: String,
        required: [true, 'Màu sắc là bắt buộc'],
        trim: true,
        match: [/^#[0-9A-Fa-f]{6}$/, 'Màu sắc phải là mã hex hợp lệ']
    },
    image: {
        type: String,
        required: [true, 'Hình ảnh là bắt buộc'],
        trim: true,
        validate: {
            validator: function (value: string) {
                // Allow placeholder URLs for now
                if (!value || value === '') return false;
                // Allow HTTP/HTTPS URLs or placeholder URLs
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value) ||
                    /^https?:\/\/via\.placeholder\.com/.test(value) ||
                    /^https?:\/\/res\.cloudinary\.com/.test(value);
            },
            message: 'URL hình ảnh không hợp lệ'
        }
    },
    features: [{
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Mỗi tính năng không được quá 200 ký tự']
    }],
    projects: [{
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: [200, 'Tên dự án không được quá 200 ký tự']
        },
        scale: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'Quy mô không được quá 100 ký tự']
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ['completed', 'in_progress', 'planning', 'sold_out', 'coming_soon'],
                message: 'Trạng thái phải là completed, in_progress, planning, sold_out hoặc coming_soon'
            }
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Mô tả dự án không được quá 500 ký tự']
        },
        image: {
            type: String,
            trim: true,
            validate: {
                validator: function (value: string) {
                    // Allow empty string or null
                    if (!value || value === '') return true;
                    // If value exists, validate URL format
                    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value);
                },
                message: 'URL hình ảnh không hợp lệ'
            }
        }
    }],
    stats: {
        projects: {
            type: String,
            trim: true,
            maxlength: [20, 'Số dự án không được quá 20 ký tự']
        },
        area: {
            type: String,
            trim: true,
            maxlength: [20, 'Diện tích không được quá 20 ký tự']
        },
        experience: {
            type: String,
            trim: true,
            maxlength: [20, 'Kinh nghiệm không được quá 20 ký tự']
        },
        return: {
            type: String,
            trim: true,
            maxlength: [20, 'Lợi nhuận không được quá 20 ký tự']
        },
        clients: {
            type: String,
            trim: true,
            maxlength: [20, 'Khách hàng không được quá 20 ký tự']
        },
        properties: {
            type: String,
            trim: true,
            maxlength: [20, 'Bất động sản không được quá 20 ký tự']
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    seoTitle: {
        type: String,
        trim: true,
        maxlength: [200, 'SEO title không được quá 200 ký tự']
    },
    seoDescription: {
        type: String,
        trim: true,
        maxlength: [300, 'SEO description không được quá 300 ký tự']
    },
    seoKeywords: [{
        type: String,
        trim: true,
        maxlength: [50, 'Mỗi keyword không được quá 50 ký tự']
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
BusinessFieldSchema.index({ name: 'text', description: 'text' });
// Note: slug index is automatically created by unique: true
BusinessFieldSchema.index({ isActive: 1 });
BusinessFieldSchema.index({ isFeatured: 1 });
BusinessFieldSchema.index({ sortOrder: 1 });
BusinessFieldSchema.index({ createdAt: -1 });

// Compound indexes
BusinessFieldSchema.index({ isActive: 1, isFeatured: 1 });
BusinessFieldSchema.index({ isActive: 1, sortOrder: 1 });

// Static methods
BusinessFieldSchema.statics.findBySlug = function (slug: string) {
    return this.findOne({ slug, isActive: true });
};

// Virtual for status display
BusinessFieldSchema.virtual('statusDisplay').get(function () {
    const statusMap = {
        'completed': 'Hoàn thành',
        'in_progress': 'Đang thi công',
        'planning': 'Đang lập kế hoạch',
        'sold_out': 'Đã bán hết',
        'coming_soon': 'Sắp mở bán'
    };
    return statusMap;
});

// Pre-save middleware to generate slug if not provided
BusinessFieldSchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        const slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        this.slug = slug;
    }
    next();
});

// Static method to find active fields
BusinessFieldSchema.statics.findActiveFields = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
};

// Static method to find featured fields
BusinessFieldSchema.statics.findFeaturedFields = function () {
    return this.find({ isFeatured: true, isActive: true }).sort({ sortOrder: 1 });
};

// Static method to find by slug
BusinessFieldSchema.statics.findBySlug = function (slug: string) {
    return this.findOne({ slug, isActive: true });
};

// Static method to search fields
BusinessFieldSchema.statics.searchFields = function (query: string) {
    return this.find({
        $text: { $search: query },
        isActive: true
    }).sort({ sortOrder: 1, createdAt: -1 });
};

// Static methods interface
interface IBusinessFieldModel extends mongoose.Model<IBusinessField> {
    findBySlug(slug: string): Promise<IBusinessField | null>;
}

// Export the model
const BusinessField = mongoose.model<IBusinessField, IBusinessFieldModel>('BusinessField', BusinessFieldSchema);

export default BusinessField;
