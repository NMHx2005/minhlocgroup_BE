import mongoose, { Document, Schema } from 'mongoose';

export interface INewsArticle extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    categoryId: mongoose.Types.ObjectId;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    author: {
        id: mongoose.Types.ObjectId;
        name: string;
    };
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };
    social: {
        facebookTitle?: string;
        facebookDescription?: string;
        twitterTitle?: string;
        twitterDescription?: string;
    };
    statistics: {
        views: number;
        likes: number;
        shares: number;
        comments: number;
    };
    isFeatured: boolean;
    isBreaking: boolean;
    allowComments: boolean;
    readingTime: number; // in minutes
    wordCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const NewsArticleSchema = new Schema<INewsArticle>({
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
        type: Schema.Types.ObjectId,
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
            validator: function (this: INewsArticle, value: Date) {
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
            type: Schema.Types.ObjectId,
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

// Indexes for performance
NewsArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
// Note: slug index is automatically created by unique: true
NewsArticleSchema.index({ categoryId: 1 });
NewsArticleSchema.index({ status: 1 });
NewsArticleSchema.index({ publishedAt: -1 });
NewsArticleSchema.index({ 'author.id': 1 });
NewsArticleSchema.index({ isFeatured: 1 });
NewsArticleSchema.index({ isBreaking: 1 });
NewsArticleSchema.index({ tags: 1 });
NewsArticleSchema.index({ createdAt: -1 });

// Compound indexes
NewsArticleSchema.index({ status: 1, publishedAt: -1 });
NewsArticleSchema.index({ categoryId: 1, status: 1, publishedAt: -1 });
NewsArticleSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 });
NewsArticleSchema.index({ isBreaking: 1, status: 1, publishedAt: -1 });
NewsArticleSchema.index({ 'author.id': 1, status: 1 });

// Virtual for category
NewsArticleSchema.virtual('category', {
    ref: 'NewsCategory',
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true
});

// Virtual for URL
NewsArticleSchema.virtual('url').get(function () {
    return `/news/${this.slug}`;
});

// Virtual for full image URL
NewsArticleSchema.virtual('fullImageUrl').get(function () {
    if (!this.featuredImage) return null;
    if (this.featuredImage.startsWith('http')) {
        return this.featuredImage;
    }
    return `${process.env.BASE_URL || ''}${this.featuredImage}`;
});

// Virtual for social sharing URLs
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

// Pre-save middleware to generate slug from title
NewsArticleSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
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

// Pre-save middleware to calculate reading time and word count
NewsArticleSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        // Calculate word count (rough estimation)
        const words = this.content.trim().split(/\s+/).length;
        this.wordCount = words;

        // Calculate reading time (average 200 words per minute)
        this.readingTime = Math.ceil(words / 200);
    }
    next();
});

// Pre-save middleware to set publishedAt when status changes to published
NewsArticleSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Pre-save middleware to set SEO fields if not provided
NewsArticleSchema.pre('save', function (next) {
    if (!this.seo.metaTitle) {
        this.seo.metaTitle = this.title;
    }
    if (!this.seo.metaDescription) {
        this.seo.metaDescription = this.excerpt;
    }
    next();
});

// Static method to find published articles
NewsArticleSchema.statics.findPublishedArticles = function () {
    return this.find({
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};

// Static method to find featured articles
NewsArticleSchema.statics.findFeaturedArticles = function () {
    return this.find({
        isFeatured: true,
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};

// Static method to find breaking news
NewsArticleSchema.statics.findBreakingNews = function () {
    return this.find({
        isBreaking: true,
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};

// Static method to find by category
NewsArticleSchema.statics.findByCategory = function (categoryId: string) {
    return this.find({
        categoryId,
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};

// Static method to find by author
NewsArticleSchema.statics.findByAuthor = function (authorId: string) {
    return this.find({
        'author.id': authorId,
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};

// Static method to search articles
NewsArticleSchema.statics.searchArticles = function (query: string) {
    return this.find({
        $text: { $search: query },
        status: 'published',
        publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
};

// Static method to find by slug
NewsArticleSchema.statics.findBySlug = function (slug: string) {
    return this.findOne({
        slug,
        status: 'published',
        publishedAt: { $lte: new Date() }
    });
};

// Static method to find related articles
NewsArticleSchema.statics.findRelatedArticles = function (articleId: string, categoryId: string, limit: number = 5) {
    return this.find({
        _id: { $ne: articleId },
        categoryId,
        status: 'published',
        publishedAt: { $lte: new Date() }
    })
        .sort({ publishedAt: -1 })
        .limit(limit);
};

// Static method to get popular articles
NewsArticleSchema.statics.getPopularArticles = function (limit: number = 10) {
    return this.find({
        status: 'published',
        publishedAt: { $lte: new Date() }
    })
        .sort({ 'statistics.views': -1, publishedAt: -1 })
        .limit(limit);
};

// Instance method to increment view count
NewsArticleSchema.methods.incrementView = function () {
    this.statistics.views += 1;
    return this.save();
};

// Instance method to increment like count
NewsArticleSchema.methods.incrementLike = function () {
    this.statistics.likes += 1;
    return this.save();
};

// Instance method to increment share count
NewsArticleSchema.methods.incrementShare = function () {
    this.statistics.shares += 1;
    return this.save();
};

// Export the model
const NewsArticle = mongoose.model<INewsArticle>('NewsArticle', NewsArticleSchema);

export default NewsArticle;
