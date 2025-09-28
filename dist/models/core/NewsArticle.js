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
const NewsArticleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề bài viết là bắt buộc'],
        trim: true,
        minlength: [10, 'Tiêu đề phải có ít nhất 10 ký tự'],
        maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
    },
    slug: {
        type: String,
        required: [true, 'Slug là bắt buộc'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang'
        ]
    },
    excerpt: {
        type: String,
        required: [true, 'Tóm tắt bài viết là bắt buộc'],
        trim: true,
        minlength: [20, 'Tóm tắt phải có ít nhất 20 ký tự'],
        maxlength: [500, 'Tóm tắt không được quá 500 ký tự']
    },
    content: {
        type: String,
        required: [true, 'Nội dung bài viết là bắt buộc'],
        trim: true,
        minlength: [100, 'Nội dung phải có ít nhất 100 ký tự']
    },
    featuredImage: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
            'URL hình ảnh đại diện không hợp lệ'
        ]
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'NewsCategory',
        required: [true, 'Danh mục là bắt buộc']
    },
    tags: [{
            type: String,
            trim: true,
            maxlength: [50, 'Mỗi tag không được quá 50 ký tự']
        }],
    status: {
        type: String,
        required: [true, 'Trạng thái bài viết là bắt buộc'],
        enum: {
            values: ['draft', 'published', 'archived'],
            message: 'Trạng thái phải là draft, published hoặc archived'
        },
        default: 'draft'
    },
    publishedAt: {
        type: Date,
        validate: {
            validator: function (value) {
                if (this.status === 'published' && !value) {
                    return false;
                }
                return true;
            },
            message: 'Ngày xuất bản là bắt buộc khi trạng thái là published'
        }
    },
    author: {
        id: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'ID tác giả là bắt buộc']
        },
        name: {
            type: String,
            required: [true, 'Tên tác giả là bắt buộc'],
            trim: true,
            maxlength: [100, 'Tên tác giả không được quá 100 ký tự']
        }
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
        keywords: [{
                type: String,
                trim: true,
                maxlength: [50, 'Mỗi từ khóa không được quá 50 ký tự']
            }]
    },
    social: {
        facebookTitle: {
            type: String,
            trim: true,
            maxlength: [100, 'Facebook title không được quá 100 ký tự']
        },
        facebookDescription: {
            type: String,
            trim: true,
            maxlength: [200, 'Facebook description không được quá 200 ký tự']
        },
        twitterTitle: {
            type: String,
            trim: true,
            maxlength: [70, 'Twitter title không được quá 70 ký tự']
        },
        twitterDescription: {
            type: String,
            trim: true,
            maxlength: [200, 'Twitter description không được quá 200 ký tự']
        }
    },
    statistics: {
        views: {
            type: Number,
            default: 0,
            min: [0, 'Số lượt xem không được âm']
        },
        likes: {
            type: Number,
            default: 0,
            min: [0, 'Số lượt thích không được âm']
        },
        shares: {
            type: Number,
            default: 0,
            min: [0, 'Số lượt chia sẻ không được âm']
        },
        comments: {
            type: Number,
            default: 0,
            min: [0, 'Số bình luận không được âm']
        }
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isBreaking: {
        type: Boolean,
        default: false
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    readingTime: {
        type: Number,
        default: 0,
        min: [0, 'Thời gian đọc không được âm']
    },
    wordCount: {
        type: Number,
        default: 0,
        min: [0, 'Số từ không được âm']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
NewsArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
NewsArticleSchema.index({ categoryId: 1 });
NewsArticleSchema.index({ status: 1 });
NewsArticleSchema.index({ publishedAt: -1 });
NewsArticleSchema.index({ 'author.id': 1 });
NewsArticleSchema.index({ isFeatured: 1 });
NewsArticleSchema.index({ isBreaking: 1 });
NewsArticleSchema.index({ tags: 1 });
NewsArticleSchema.index({ createdAt: -1 });
NewsArticleSchema.index({ status: 1, publishedAt: -1 });
NewsArticleSchema.index({ categoryId: 1, status: 1, publishedAt: -1 });
NewsArticleSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 });
NewsArticleSchema.index({ isBreaking: 1, status: 1, publishedAt: -1 });
NewsArticleSchema.index({ 'author.id': 1, status: 1 });
NewsArticleSchema.virtual('category', {
    ref: 'NewsCategory',
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true
});
NewsArticleSchema.virtual('url').get(function () {
    return `/news/${this.slug}`;
});
NewsArticleSchema.virtual('fullImageUrl').get(function () {
    if (!this.featuredImage)
        return null;
    if (this.featuredImage.startsWith('http')) {
        return this.featuredImage;
    }
    return `${process.env.BASE_URL || ''}${this.featuredImage}`;
});
NewsArticleSchema.virtual('shareUrls').get(function () {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const articleUrl = `${baseUrl}/news/${this.slug}`;
    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(this.title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(this.title + ' ' + articleUrl)}`
    };
});
NewsArticleSchema.pre('save', function (next) {
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
NewsArticleSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        const words = this.content.trim().split(/\s+/).length;
        this.wordCount = words;
        this.readingTime = Math.ceil(words / 200);
    }
    next();
});
NewsArticleSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});
NewsArticleSchema.pre('save', function (next) {
    if (!this.seo.metaTitle) {
        this.seo.metaTitle = this.title;
    }
    if (!this.seo.metaDescription) {
        this.seo.metaDescription = this.excerpt;
    }
    next();
});
NewsArticleSchema.statics.findPublishedArticles = function () {
    return this.find({
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};
NewsArticleSchema.statics.findFeaturedArticles = function () {
    return this.find({
        isFeatured: true,
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};
NewsArticleSchema.statics.findBreakingNews = function () {
    return this.find({
        isBreaking: true,
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};
NewsArticleSchema.statics.findByCategory = function (categoryId) {
    return this.find({
        categoryId,
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};
NewsArticleSchema.statics.findByAuthor = function (authorId) {
    return this.find({
        'author.id': authorId,
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};
NewsArticleSchema.statics.searchArticles = function (query) {
    return this.find({
        $text: { $search: query },
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};
NewsArticleSchema.statics.findBySlug = function (slug) {
    return this.findOne({
        slug,
        status: 'published',
        publishedAt: { $lte: new Date() }
    });
};
NewsArticleSchema.statics.findRelatedArticles = function (articleId, categoryId, limit = 5) {
    return this.find({
        _id: { $ne: articleId },
        categoryId,
        status: 'published',
        publishedAt: { $lte: new Date() }
    })
        .sort({ publishedAt: -1 })
        .limit(limit);
};
NewsArticleSchema.statics.getPopularArticles = function (limit = 10) {
    return this.find({
        status: 'published',
        publishedAt: { $lte: new Date() }
    })
        .sort({ 'statistics.views': -1, publishedAt: -1 })
        .limit(limit);
};
NewsArticleSchema.methods.incrementView = function () {
    this.statistics.views += 1;
    return this.save();
};
NewsArticleSchema.methods.incrementLike = function () {
    this.statistics.likes += 1;
    return this.save();
};
NewsArticleSchema.methods.incrementShare = function () {
    this.statistics.shares += 1;
    return this.save();
};
const NewsArticle = mongoose_1.default.model('NewsArticle', NewsArticleSchema);
exports.default = NewsArticle;
//# sourceMappingURL=NewsArticle.js.map