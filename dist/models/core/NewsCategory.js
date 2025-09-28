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
const NewsCategorySchema = new mongoose_1.Schema({
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
NewsCategorySchema.index({ name: 'text', description: 'text' });
NewsCategorySchema.index({ slug: 1 });
NewsCategorySchema.index({ isActive: 1 });
NewsCategorySchema.index({ sortOrder: 1 });
NewsCategorySchema.virtual('url').get(function () {
    return `/news/category/${this.slug}`;
});
NewsCategorySchema.pre('save', function (next) {
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
NewsCategorySchema.statics.findActiveCategories = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};
NewsCategorySchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug, isActive: true });
};
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
const NewsCategory = mongoose_1.default.model('NewsCategory', NewsCategorySchema);
exports.default = NewsCategory;
//# sourceMappingURL=NewsCategory.js.map