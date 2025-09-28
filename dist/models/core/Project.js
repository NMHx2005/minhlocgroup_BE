"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProjectSchema = new mongoose_1.Schema({
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
                validator: function (value) {
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
                validator: function (value) {
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
                validator: function (url) {
                    try {
                        if (url.startsWith('data:image/')) {
                            return true;
                        }
                        const urlObj = new URL(url);
                        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
                    }
                    catch {
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
            validator: function (phone) {
                if (!phone)
                    return true;
                const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
                return phoneRegex.test(phone);
            },
            message: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ'
        }
    },
    completionDate: {
        type: Date,
        validate: {
            validator: function (value) {
                if (!value)
                    return true;
                if (this.status === 'completed')
                    return true;
                if (this.isNew) {
                    return value > new Date();
                }
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
            validator: function (value) {
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
ProjectSchema.index({ name: 'text', description: 'text', location: 'text' });
ProjectSchema.index({ type: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ 'price.min': 1, 'price.max': 1 });
ProjectSchema.index({ 'area.min': 1, 'area.max': 1 });
ProjectSchema.index({ developer: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ type: 1, status: 1, isActive: 1 });
ProjectSchema.index({ isFeatured: 1, isActive: 1 });
ProjectSchema.index({ status: 1, isActive: 1 });
ProjectSchema.virtual('remainingUnits').get(function () {
    return this.totalUnits - this.soldUnits;
});
ProjectSchema.virtual('priceRange').get(function () {
    const formatPrice = (price) => {
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
ProjectSchema.virtual('areaRange').get(function () {
    if (this.area.min === this.area.max) {
        return `${this.area.min} ${this.area.unit}`;
    }
    return `${this.area.min} - ${this.area.max} ${this.area.unit}`;
});
ProjectSchema.pre('save', function (next) {
    this.salesRate = this.totalUnits > 0 ? (this.soldUnits / this.totalUnits) * 100 : 0;
    if (this.isModified() && !this.isNew && !this.updatedBy && this.createdBy) {
        this.updatedBy = this.createdBy;
    }
    next();
});
ProjectSchema.statics.findActiveProjects = function () {
    return this.find({ isActive: true });
};
ProjectSchema.statics.findFeaturedProjects = function () {
    return this.find({ isFeatured: true, isActive: true });
};
ProjectSchema.statics.findByType = function (type) {
    return this.find({ type, isActive: true });
};
ProjectSchema.statics.findByStatus = function (status) {
    return this.find({ status, isActive: true });
};
ProjectSchema.statics.searchProjects = function (query) {
    return this.find({
        $text: { $search: query },
        isActive: true
    });
};
ProjectSchema.statics.findByPriceRange = function (minPrice, maxPrice) {
    return this.find({
        'price.min': { $lte: maxPrice },
        'price.max': { $gte: minPrice },
        isActive: true
    });
};
ProjectSchema.statics.findByAreaRange = function (minArea, maxArea) {
    return this.find({
        'area.min': { $lte: maxArea },
        'area.max': { $gte: minArea },
        isActive: true
    });
};
const Project = mongoose_1.default.model('Project', ProjectSchema);
exports.default = Project;
//# sourceMappingURL=Project.js.map