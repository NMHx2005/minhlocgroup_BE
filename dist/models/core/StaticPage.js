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
const StaticPageSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề trang là bắt buộc'],
        trim: true,
        minlength: [2, 'Tiêu đề phải có ít nhất 2 ký tự'],
        maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
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
    content: {
        type: String,
        required: [true, 'Nội dung trang là bắt buộc'],
        minlength: [10, 'Nội dung phải có ít nhất 10 ký tự']
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: [500, 'Tóm tắt không được quá 500 ký tự']
    },
    template: {
        type: String,
        trim: true,
        maxlength: [100, 'Template không được quá 100 ký tự']
    },
    status: {
        type: String,
        required: [true, 'Trạng thái trang là bắt buộc'],
        enum: {
            values: ['active', 'inactive', 'draft'],
            message: 'Trạng thái phải là active, inactive hoặc draft'
        },
        default: 'draft'
    },
    seo: {
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
            }],
        ogTitle: {
            type: String,
            trim: true,
            maxlength: [100, 'OG title không được quá 100 ký tự']
        },
        ogDescription: {
            type: String,
            trim: true,
            maxlength: [200, 'OG description không được quá 200 ký tự']
        },
        ogImage: {
            type: String,
            trim: true,
            match: [
                /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                'URL OG image không hợp lệ'
            ]
        },
        canonicalUrl: {
            type: String,
            trim: true,
            match: [
                /^https?:\/\/.+/,
                'Canonical URL phải bắt đầu bằng http:// hoặc https://'
            ]
        }
    },
    isHomepage: {
        type: Boolean,
        default: false
    },
    isFooter: {
        type: Boolean,
        default: false
    },
    isHeader: {
        type: Boolean,
        default: false
    },
    sortOrder: {
        type: Number,
        default: 0,
        min: [0, 'Thứ tự sắp xếp không được âm']
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'StaticPage'
    },
    viewCount: {
        type: Number,
        default: 0,
        min: [0, 'Số lượt xem không được âm']
    },
    lastViewedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo là bắt buộc']
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người cập nhật là bắt buộc']
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
StaticPageSchema.index({ status: 1 });
StaticPageSchema.index({ isHomepage: 1 });
StaticPageSchema.index({ isFooter: 1 });
StaticPageSchema.index({ isHeader: 1 });
StaticPageSchema.index({ parentId: 1 });
StaticPageSchema.index({ sortOrder: 1 });
StaticPageSchema.index({ createdBy: 1 });
StaticPageSchema.index({ publishedAt: -1 });
StaticPageSchema.index({ viewCount: -1 });
StaticPageSchema.index({ status: 1, isHomepage: 1 });
StaticPageSchema.index({ status: 1, isFooter: 1 });
StaticPageSchema.index({ status: 1, isHeader: 1 });
StaticPageSchema.index({ parentId: 1, status: 1 });
StaticPageSchema.index({ status: 1, sortOrder: 1 });
StaticPageSchema.virtual('creator', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});
StaticPageSchema.virtual('updater', {
    ref: 'User',
    localField: 'updatedBy',
    foreignField: '_id',
    justOne: true
});
StaticPageSchema.virtual('parentPage', {
    ref: 'StaticPage',
    localField: 'parentId',
    foreignField: '_id',
    justOne: true
});
StaticPageSchema.virtual('childPages', {
    ref: 'StaticPage',
    localField: '_id',
    foreignField: 'parentId'
});
StaticPageSchema.virtual('url').get(function () {
    return `/${this.slug}`;
});
StaticPageSchema.virtual('fullUrl').get(function () {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/${this.slug}`;
});
StaticPageSchema.virtual('wordCount').get(function () {
    return this.content.trim().split(/\s+/).length;
});
StaticPageSchema.virtual('readingTime').get(function () {
    const words = this.wordCount;
    return Math.ceil(words / 200);
});
StaticPageSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
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
StaticPageSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'active' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});
StaticPageSchema.pre('save', function (next) {
    if (!this.seo.metaTitle) {
        this.seo.metaTitle = this.title;
    }
    if (!this.seo.metaDescription && this.excerpt) {
        this.seo.metaDescription = this.excerpt;
    }
    if (!this.seo.ogTitle) {
        this.seo.ogTitle = this.title;
    }
    if (!this.seo.ogDescription && this.excerpt) {
        this.seo.ogDescription = this.excerpt;
    }
    next();
});
StaticPageSchema.statics.findActivePages = function () {
    return this.find({ status: 'active' }).sort({ sortOrder: 1, title: 1 });
};
StaticPageSchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug, status: 'active' });
};
StaticPageSchema.statics.findHomepage = function () {
    return this.findOne({ isHomepage: true, status: 'active' });
};
StaticPageSchema.statics.findFooterPages = function () {
    return this.find({ isFooter: true, status: 'active' }).sort({ sortOrder: 1, title: 1 });
};
StaticPageSchema.statics.findHeaderPages = function () {
    return this.find({ isHeader: true, status: 'active' }).sort({ sortOrder: 1, title: 1 });
};
StaticPageSchema.statics.findByParent = function (parentId) {
    return this.find({ parentId, status: 'active' }).sort({ sortOrder: 1, title: 1 });
};
StaticPageSchema.statics.findRootPages = function () {
    return this.find({ parentId: null, status: 'active' }).sort({ sortOrder: 1, title: 1 });
};
StaticPageSchema.statics.findByCreator = function (creatorId) {
    return this.find({ createdBy: creatorId }).sort({ createdAt: -1 });
};
StaticPageSchema.statics.searchPages = function (query) {
    return this.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { excerpt: { $regex: query, $options: 'i' } }
        ],
        status: 'active'
    }).sort({ title: 1 });
};
StaticPageSchema.statics.getPageTree = async function () {
    const pages = await this.find({ status: 'active' })
        .populate('parentPage', 'title slug')
        .sort({ sortOrder: 1, title: 1 });
    const tree = [];
    const pageMap = new Map();
    pages.forEach((page) => {
        pageMap.set(page._id.toString(), {
            ...page.toObject(),
            children: []
        });
    });
    pages.forEach((page) => {
        if (page.parentId) {
            const parent = pageMap.get(page.parentId.toString());
            if (parent) {
                parent.children.push(pageMap.get(page._id.toString()));
            }
        }
        else {
            tree.push(pageMap.get(page._id.toString()));
        }
    });
    return tree;
};
StaticPageSchema.methods.incrementView = function () {
    this.viewCount += 1;
    this.lastViewedAt = new Date();
    return this.save();
};
StaticPageSchema.methods.publish = function () {
    this.status = 'active';
    this.publishedAt = new Date();
    return this.save();
};
StaticPageSchema.methods.unpublish = function () {
    this.status = 'inactive';
    return this.save();
};
StaticPageSchema.methods.setHomepage = async function () {
    await this.constructor.updateMany({ isHomepage: true }, { isHomepage: false });
    this.isHomepage = true;
    return this.save();
};
StaticPageSchema.methods.addToFooter = function () {
    this.isFooter = true;
    return this.save();
};
StaticPageSchema.methods.addToHeader = function () {
    this.isHeader = true;
    return this.save();
};
const StaticPage = mongoose_1.default.model('StaticPage', StaticPageSchema);
exports.default = StaticPage;
//# sourceMappingURL=StaticPage.js.map