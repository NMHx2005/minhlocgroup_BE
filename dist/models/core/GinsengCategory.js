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
const GinsengCategorySchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
GinsengCategorySchema.index({ parentId: 1 });
GinsengCategorySchema.index({ isActive: 1 });
GinsengCategorySchema.index({ sortOrder: 1 });
GinsengCategorySchema.index({ parentId: 1, isActive: 1 });
GinsengCategorySchema.index({ isActive: 1, sortOrder: 1 });
GinsengCategorySchema.virtual('productCount', {
    ref: 'GinsengProduct',
    localField: '_id',
    foreignField: 'categoryId',
    count: true
});
GinsengCategorySchema.virtual('childCategories', {
    ref: 'GinsengCategory',
    localField: '_id',
    foreignField: 'parentId'
});
GinsengCategorySchema.virtual('parentCategory', {
    ref: 'GinsengCategory',
    localField: 'parentId',
    foreignField: '_id',
    justOne: true
});
GinsengCategorySchema.virtual('fullPath').get(function () {
    if (this.parentCategory) {
        return `${this.parentCategory.name} > ${this.name}`;
    }
    return this.name;
});
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
GinsengCategorySchema.pre('save', function (next) {
    if (!this.metaTitle) {
        this.metaTitle = this.name;
    }
    if (!this.metaDescription && this.description) {
        this.metaDescription = this.description.substring(0, 160);
    }
    next();
});
GinsengCategorySchema.statics.findActiveCategories = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};
GinsengCategorySchema.statics.findRootCategories = function () {
    return this.find({
        parentId: null,
        isActive: true
    }).sort({ sortOrder: 1, name: 1 });
};
GinsengCategorySchema.statics.findChildCategories = function (parentId) {
    return this.find({
        parentId,
        isActive: true
    }).sort({ sortOrder: 1, name: 1 });
};
GinsengCategorySchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug, isActive: true });
};
GinsengCategorySchema.statics.getCategoryTree = async function () {
    const categories = await this.find({ isActive: true })
        .populate('parentCategory', 'name slug')
        .sort({ sortOrder: 1, name: 1 });
    const tree = [];
    const categoryMap = new Map();
    categories.forEach((cat) => {
        categoryMap.set(cat._id.toString(), {
            ...cat.toObject(),
            children: []
        });
    });
    categories.forEach((cat) => {
        if (cat.parentId) {
            const parent = categoryMap.get(cat.parentId.toString());
            if (parent) {
                parent.children.push(categoryMap.get(cat._id.toString()));
            }
        }
        else {
            tree.push(categoryMap.get(cat._id.toString()));
        }
    });
    return tree;
};
const GinsengCategory = mongoose_1.default.model('GinsengCategory', GinsengCategorySchema);
exports.default = GinsengCategory;
//# sourceMappingURL=GinsengCategory.js.map