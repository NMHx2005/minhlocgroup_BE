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
const BusinessFieldSchema = new mongoose_1.Schema({
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
            validator: function (value) {
                if (!value || value === '')
                    return false;
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
                    validator: function (value) {
                        if (!value || value === '')
                            return true;
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
BusinessFieldSchema.index({ name: 'text', description: 'text' });
BusinessFieldSchema.index({ isActive: 1 });
BusinessFieldSchema.index({ isFeatured: 1 });
BusinessFieldSchema.index({ sortOrder: 1 });
BusinessFieldSchema.index({ createdAt: -1 });
BusinessFieldSchema.index({ isActive: 1, isFeatured: 1 });
BusinessFieldSchema.index({ isActive: 1, sortOrder: 1 });
BusinessFieldSchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug, isActive: true });
};
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
BusinessFieldSchema.statics.findActiveFields = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
};
BusinessFieldSchema.statics.findFeaturedFields = function () {
    return this.find({ isFeatured: true, isActive: true }).sort({ sortOrder: 1 });
};
BusinessFieldSchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug, isActive: true });
};
BusinessFieldSchema.statics.searchFields = function (query) {
    return this.find({
        $text: { $search: query },
        isActive: true
    }).sort({ sortOrder: 1, createdAt: -1 });
};
const BusinessField = mongoose_1.default.model('BusinessField', BusinessFieldSchema);
exports.default = BusinessField;
//# sourceMappingURL=BusinessField.js.map