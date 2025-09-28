import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    name: string;
    slug: string;
    description: string;
    content: string;
    location: string;
    type: 'apartment' | 'villa' | 'office' | 'commercial';
    status: 'planning' | 'construction' | 'completed' | 'sold_out';
    price: {
        min: number;
        max: number;
        currency: string;
    };
    area: {
        min: number;
        max: number;
        unit: string;
    };
    images: string[];
    features: string[];
    amenities: string[];
    developer: string;
    phone?: string;
    completionDate?: Date;
    totalUnits: number;
    soldUnits: number;
    salesRate: number;
    revenue: number;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: [true, 'Tên dự án là bắt buộc'],
        trim: true,
        minlength: [5, 'Tên dự án phải có ít nhất 5 ký tự'],
        maxlength: [200, 'Tên dự án không được quá 200 ký tự']
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
        required: [true, 'Mô tả dự án là bắt buộc'],
        trim: true,
        minlength: [20, 'Mô tả phải có ít nhất 20 ký tự'],
        maxlength: [2000, 'Mô tả không được quá 2000 ký tự']
    },
    content: {
        type: String,
        required: [true, 'Nội dung dự án là bắt buộc'],
        minlength: [50, 'Nội dung phải có ít nhất 50 ký tự']
    },
    location: {
        type: String,
        required: [true, 'Địa điểm là bắt buộc'],
        trim: true,
        minlength: [5, 'Địa điểm phải có ít nhất 5 ký tự'],
        maxlength: [300, 'Địa điểm không được quá 300 ký tự']
    },
    type: {
        type: String,
        required: [true, 'Loại dự án là bắt buộc'],
        enum: {
            values: ['apartment', 'villa', 'office', 'commercial'],
            message: 'Loại dự án phải là apartment, villa, office hoặc commercial'
        }
    },
    status: {
        type: String,
        required: [true, 'Trạng thái dự án là bắt buộc'],
        enum: {
            values: ['planning', 'construction', 'completed', 'sold_out'],
            message: 'Trạng thái phải là planning, construction, completed hoặc sold_out'
        },
        default: 'planning'
    },
    price: {
        min: {
            type: Number,
            required: [true, 'Giá tối thiểu là bắt buộc'],
            min: [0, 'Giá tối thiểu không được âm']
        },
        max: {
            type: Number,
            required: [true, 'Giá tối đa là bắt buộc'],
            min: [0, 'Giá tối đa không được âm'],
            validate: {
                validator: function (this: IProject, value: number) {
                    return !this.price?.min || value >= this.price.min;
                },
                message: 'Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu'
            }
        },
        currency: {
            type: String,
            required: [true, 'Đơn vị tiền tệ là bắt buộc'],
            enum: {
                values: ['VND', 'USD', 'EUR'],
                message: 'Đơn vị tiền tệ phải là VND, USD hoặc EUR'
            },
            default: 'VND'
        }
    },
    area: {
        min: {
            type: Number,
            required: [true, 'Diện tích tối thiểu là bắt buộc'],
            min: [0, 'Diện tích tối thiểu không được âm']
        },
        max: {
            type: Number,
            required: [true, 'Diện tích tối đa là bắt buộc'],
            min: [0, 'Diện tích tối đa không được âm'],
            validate: {
                validator: function (this: IProject, value: number) {
                    return !this.area?.min || value >= this.area.min;
                },
                message: 'Diện tích tối đa phải lớn hơn hoặc bằng diện tích tối thiểu'
            }
        },
        unit: {
            type: String,
            required: [true, 'Đơn vị diện tích là bắt buộc'],
            enum: {
                values: ['m2', 'sqft'],
                message: 'Đơn vị diện tích phải là m2 hoặc sqft'
            },
            default: 'm2'
        }
    },
    images: [{
        type: String,
        trim: true,
        validate: {
            validator: function (url: string) {
                // Accept HTTP/HTTPS URLs and base64 data URLs
                try {
                    // Check if it's a base64 data URL
                    if (url.startsWith('data:image/')) {
                        return true;
                    }

                    // Check if it's a valid HTTP/HTTPS URL
                    const urlObj = new URL(url);
                    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
                } catch {
                    return false;
                }
            },
            message: 'URL hình ảnh không hợp lệ'
        }
    }],
    features: [{
        type: String,
        trim: true,
        maxlength: [100, 'Mỗi tính năng không được quá 100 ký tự']
    }],
    amenities: [{
        type: String,
        trim: true,
        maxlength: [100, 'Mỗi tiện ích không được quá 100 ký tự']
    }],
    developer: {
        type: String,
        required: [true, 'Chủ đầu tư là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên chủ đầu tư phải có ít nhất 2 ký tự'],
        maxlength: [200, 'Tên chủ đầu tư không được quá 200 ký tự']
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (phone: string) {
                if (!phone) return true; // Optional field
                // Vietnamese phone number validation
                const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
                return phoneRegex.test(phone);
            },
            message: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ'
        }
    },
    completionDate: {
        type: Date,
        validate: {
            validator: function (this: IProject, value: Date) {
                if (!value) return true; // Optional field

                // Nếu dự án đã hoàn thành, completionDate có thể trong quá khứ
                if (this.status === 'completed') return true;

                // Nếu dự án chưa hoàn thành, completionDate phải trong tương lai
                // Nhưng chỉ áp dụng validation này khi tạo mới, không áp dụng khi update
                if (this.isNew) {
                    return value > new Date();
                }

                // Khi update, cho phép completionDate trong quá khứ (để tránh lỗi khi update dự án cũ)
                return true;
            },
            message: 'Ngày hoàn thành phải trong tương lai (trừ khi dự án đã hoàn thành)'
        }
    },
    totalUnits: {
        type: Number,
        required: [true, 'Tổng số căn hộ là bắt buộc'],
        min: [1, 'Tổng số căn hộ phải ít nhất là 1'],
        max: [10000, 'Tổng số căn hộ không được quá 10000']
    },
    soldUnits: {
        type: Number,
        default: 0,
        min: [0, 'Số căn đã bán không được âm'],
        validate: {
            validator: function (this: IProject, value: number) {
                return !this.totalUnits || value <= this.totalUnits;
            },
            message: 'Số căn đã bán không được vượt quá tổng số căn'
        }
    },
    salesRate: {
        type: Number,
        default: 0,
        min: [0, 'Tỷ lệ bán hàng không được âm'],
        max: [100, 'Tỷ lệ bán hàng không được quá 100%']
    },
    revenue: {
        type: Number,
        default: 0,
        min: [0, 'Doanh thu không được âm']
    },
    coordinates: {
        latitude: {
            type: Number,
            min: [-90, 'Vĩ độ phải từ -90 đến 90'],
            max: [90, 'Vĩ độ phải từ -90 đến 90']
        },
        longitude: {
            type: Number,
            min: [-180, 'Kinh độ phải từ -180 đến 180'],
            max: [180, 'Kinh độ phải từ -180 đến 180']
        }
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Mỗi tag không được quá 50 ký tự']
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
ProjectSchema.index({ name: 'text', description: 'text', location: 'text' });
ProjectSchema.index({ type: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ createdAt: -1 });
// Note: slug index is automatically created by unique: true
ProjectSchema.index({ 'price.min': 1, 'price.max': 1 });
ProjectSchema.index({ 'area.min': 1, 'area.max': 1 });
ProjectSchema.index({ developer: 1 });
ProjectSchema.index({ tags: 1 });

// Compound indexes
ProjectSchema.index({ type: 1, status: 1, isActive: 1 });
ProjectSchema.index({ isFeatured: 1, isActive: 1 });
ProjectSchema.index({ status: 1, isActive: 1 });

// Virtual for remaining units
ProjectSchema.virtual('remainingUnits').get(function () {
    return this.totalUnits - this.soldUnits;
});

// Virtual for price range display
ProjectSchema.virtual('priceRange').get(function () {
    const formatPrice = (price: number) => {
        if (this.price.currency === 'VND') {
            return `${(price / 1000000).toFixed(1)}M VND`;
        }
        return `${price.toLocaleString()} ${this.price.currency}`;
    };

    if (this.price.min === this.price.max) {
        return formatPrice(this.price.min);
    }
    return `${formatPrice(this.price.min)} - ${formatPrice(this.price.max)}`;
});

// Virtual for area range display
ProjectSchema.virtual('areaRange').get(function () {
    if (this.area.min === this.area.max) {
        return `${this.area.min} ${this.area.unit}`;
    }
    return `${this.area.min} - ${this.area.max} ${this.area.unit}`;
});

// Pre-save middleware to calculate sales rate
ProjectSchema.pre('save', function (next) {
    // Always calculate sales rate
    this.salesRate = this.totalUnits > 0 ? (this.soldUnits / this.totalUnits) * 100 : 0;

    // Set updatedBy if not provided and document is being modified
    if (this.isModified() && !this.isNew && !this.updatedBy && this.createdBy) {
        this.updatedBy = this.createdBy;
    }

    next();
});

// Static method to find active projects
ProjectSchema.statics.findActiveProjects = function () {
    return this.find({ isActive: true });
};

// Static method to find featured projects
ProjectSchema.statics.findFeaturedProjects = function () {
    return this.find({ isFeatured: true, isActive: true });
};

// Static method to find by type
ProjectSchema.statics.findByType = function (type: string) {
    return this.find({ type, isActive: true });
};

// Static method to find by status
ProjectSchema.statics.findByStatus = function (status: string) {
    return this.find({ status, isActive: true });
};

// Static method to search projects
ProjectSchema.statics.searchProjects = function (query: string) {
    return this.find({
        $text: { $search: query },
        isActive: true
    });
};

// Static method to find projects by price range
ProjectSchema.statics.findByPriceRange = function (minPrice: number, maxPrice: number) {
    return this.find({
        'price.min': { $lte: maxPrice },
        'price.max': { $gte: minPrice },
        isActive: true
    });
};

// Static method to find projects by area range
ProjectSchema.statics.findByAreaRange = function (minArea: number, maxArea: number) {
    return this.find({
        'area.min': { $lte: maxArea },
        'area.max': { $gte: minArea },
        isActive: true
    });
};

// Export the model
const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
