import mongoose, { Document, Schema } from 'mongoose';

export interface IStaticPage extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    template?: string;
    status: 'active' | 'inactive' | 'draft';
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string[];
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;
        canonicalUrl?: string;
    };
    isHomepage: boolean;
    isFooter: boolean;
    isHeader: boolean;
    sortOrder: number;
    parentId?: mongoose.Types.ObjectId;
    viewCount: number;
    lastViewedAt?: Date;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const StaticPageSchema = new Schema<IStaticPage>({
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
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo là bắt buộc']
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
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

// Indexes
// Note: slug index is automatically created by unique: true
StaticPageSchema.index({ status: 1 });
StaticPageSchema.index({ isHomepage: 1 });
StaticPageSchema.index({ isFooter: 1 });
StaticPageSchema.index({ isHeader: 1 });
StaticPageSchema.index({ parentId: 1 });
StaticPageSchema.index({ sortOrder: 1 });
StaticPageSchema.index({ createdBy: 1 });
StaticPageSchema.index({ publishedAt: -1 });
StaticPageSchema.index({ viewCount: -1 });

// Compound indexes
StaticPageSchema.index({ status: 1, isHomepage: 1 });
StaticPageSchema.index({ status: 1, isFooter: 1 });
StaticPageSchema.index({ status: 1, isHeader: 1 });
StaticPageSchema.index({ parentId: 1, status: 1 });
StaticPageSchema.index({ status: 1, sortOrder: 1 });

// Virtual for creator
StaticPageSchema.virtual('creator', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});

// Virtual for updater
StaticPageSchema.virtual('updater', {
    ref: 'User',
    localField: 'updatedBy',
    foreignField: '_id',
    justOne: true
});

// Virtual for parent page
StaticPageSchema.virtual('parentPage', {
    ref: 'StaticPage',
    localField: 'parentId',
    foreignField: '_id',
    justOne: true
});

// Virtual for child pages
StaticPageSchema.virtual('childPages', {
    ref: 'StaticPage',
    localField: '_id',
    foreignField: 'parentId'
});

// Virtual for URL
StaticPageSchema.virtual('url').get(function () {
    return `/${this.slug}`;
});

// Virtual for full URL
StaticPageSchema.virtual('fullUrl').get(function () {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/${this.slug}`;
});

// Virtual for word count
StaticPageSchema.virtual('wordCount').get(function (this: any) {
    return this.content.trim().split(/\s+/).length;
});

// Virtual for reading time
StaticPageSchema.virtual('readingTime').get(function (this: any) {
    const words = this.wordCount;
    return Math.ceil(words / 200); // 200 words per minute
});

// Pre-save middleware to generate slug
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

// Pre-save middleware to set publishedAt
StaticPageSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'active' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Pre-save middleware to set SEO fields
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

// Static methods
StaticPageSchema.statics.findActivePages = function () {
    return this.find({ status: 'active' }).sort({ sortOrder: 1, title: 1 });
};

StaticPageSchema.statics.findBySlug = function (slug: string) {
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

StaticPageSchema.statics.findByParent = function (parentId: string) {
    return this.find({ parentId, status: 'active' }).sort({ sortOrder: 1, title: 1 });
};

StaticPageSchema.statics.findRootPages = function () {
    return this.find({ parentId: null, status: 'active' }).sort({ sortOrder: 1, title: 1 });
};

StaticPageSchema.statics.findByCreator = function (creatorId: string) {
    return this.find({ createdBy: creatorId }).sort({ createdAt: -1 });
};

StaticPageSchema.statics.searchPages = function (query: string) {
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

    const tree: any[] = [];
    const pageMap = new Map();

    // Create a map of all pages
    pages.forEach((page: any) => {
        pageMap.set(page._id.toString(), {
            ...page.toObject(),
            children: []
        });
    });

    // Build the tree
    pages.forEach((page: any) => {
        if (page.parentId) {
            const parent = pageMap.get(page.parentId.toString());
            if (parent) {
                parent.children.push(pageMap.get(page._id.toString()));
            }
        } else {
            tree.push(pageMap.get(page._id.toString()));
        }
    });

    return tree;
};

// Instance methods
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
    // Remove homepage flag from other pages
    await (this.constructor as any).updateMany(
        { isHomepage: true },
        { isHomepage: false }
    );

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

const StaticPage = mongoose.model<IStaticPage>('StaticPage', StaticPageSchema);

export default StaticPage;
