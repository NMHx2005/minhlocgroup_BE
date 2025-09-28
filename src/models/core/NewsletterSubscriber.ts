import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletterSubscriber extends Document {
    email: string;
    name?: string;
    status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
    interests: string[];
    source: 'website' | 'facebook' | 'google' | 'referral' | 'other';
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    subscribedAt: Date;
    unsubscribedAt?: Date;
    lastEmailSentAt?: Date;
    totalEmailsSent: number;
    totalEmailsOpened: number;
    totalEmailsClicked: number;
    isVerified: boolean;
    verificationToken?: string;
    verificationExpiresAt?: Date;
    tags: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Email không hợp lệ'
        ]
    },
    name: {
        type: String,
        trim: true,
        maxlength: [100, 'Tên không được quá 100 ký tự']
    },
    status: {
        type: String,
        required: [true, 'Trạng thái là bắt buộc'],
        enum: {
            values: ['active', 'unsubscribed', 'bounced', 'complained'],
            message: 'Trạng thái phải là active, unsubscribed, bounced hoặc complained'
        },
        default: 'active'
    },
    interests: [{
        type: String,
        trim: true,
        maxlength: [50, 'Mỗi sở thích không được quá 50 ký tự']
    }],
    source: {
        type: String,
        required: [true, 'Nguồn đăng ký là bắt buộc'],
        enum: {
            values: ['website', 'facebook', 'google', 'referral', 'other'],
            message: 'Nguồn phải là website, facebook, google, referral hoặc other'
        },
        default: 'website'
    },
    utmSource: {
        type: String,
        trim: true,
        maxlength: [100, 'UTM source không được quá 100 ký tự']
    },
    utmMedium: {
        type: String,
        trim: true,
        maxlength: [100, 'UTM medium không được quá 100 ký tự']
    },
    utmCampaign: {
        type: String,
        trim: true,
        maxlength: [100, 'UTM campaign không được quá 100 ký tự']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    unsubscribedAt: {
        type: Date
    },
    lastEmailSentAt: {
        type: Date
    },
    totalEmailsSent: {
        type: Number,
        default: 0,
        min: [0, 'Tổng email đã gửi không được âm']
    },
    totalEmailsOpened: {
        type: Number,
        default: 0,
        min: [0, 'Tổng email đã mở không được âm']
    },
    totalEmailsClicked: {
        type: Number,
        default: 0,
        min: [0, 'Tổng email đã click không được âm']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        trim: true
    },
    verificationExpiresAt: {
        type: Date
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Mỗi tag không được quá 50 ký tự']
    }],
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Ghi chú không được quá 500 ký tự']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// Note: email index is automatically created by unique: true
NewsletterSubscriberSchema.index({ status: 1 });
NewsletterSubscriberSchema.index({ source: 1 });
NewsletterSubscriberSchema.index({ subscribedAt: -1 });
NewsletterSubscriberSchema.index({ interests: 1 });
NewsletterSubscriberSchema.index({ tags: 1 });

// Compound indexes
NewsletterSubscriberSchema.index({ status: 1, subscribedAt: -1 });
NewsletterSubscriberSchema.index({ source: 1, status: 1 });
NewsletterSubscriberSchema.index({ isVerified: 1, status: 1 });

// Virtual for open rate
NewsletterSubscriberSchema.virtual('openRate').get(function () {
    if (this.totalEmailsSent === 0) return 0;
    return ((this.totalEmailsOpened / this.totalEmailsSent) * 100).toFixed(2);
});

// Virtual for click rate
NewsletterSubscriberSchema.virtual('clickRate').get(function () {
    if (this.totalEmailsSent === 0) return 0;
    return ((this.totalEmailsClicked / this.totalEmailsSent) * 100).toFixed(2);
});

// Virtual for engagement score
NewsletterSubscriberSchema.virtual('engagementScore').get(function () {
    const openWeight = 0.3;
    const clickWeight = 0.7;
    const openRate = parseFloat((this as any).openRate);
    const clickRate = parseFloat((this as any).clickRate);
    return (openRate * openWeight + clickRate * clickWeight).toFixed(2);
});

// Virtual for time since subscription
NewsletterSubscriberSchema.virtual('timeSinceSubscription').get(function () {
    const now = new Date();
    const diffInMs = now.getTime() - this.subscribedAt.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return '1 ngày trước';
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} tháng trước`;
    }
    const years = Math.floor(diffInDays / 365);
    return `${years} năm trước`;
});

// Pre-save middleware to generate verification token
NewsletterSubscriberSchema.pre('save', function (next) {
    if (this.isNew && !this.verificationToken) {
        this.verificationToken = require('crypto').randomBytes(32).toString('hex');
        this.verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
    next();
});

// Pre-save middleware to set unsubscribedAt
NewsletterSubscriberSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'unsubscribed' && !this.unsubscribedAt) {
        this.unsubscribedAt = new Date();
    }
    next();
});

// Static methods
NewsletterSubscriberSchema.statics.findActiveSubscribers = function () {
    return this.find({ status: 'active' }).sort({ subscribedAt: -1 });
};

NewsletterSubscriberSchema.statics.findByInterest = function (interest: string) {
    return this.find({
        interests: interest,
        status: 'active'
    }).sort({ subscribedAt: -1 });
};

NewsletterSubscriberSchema.statics.findBySource = function (source: string) {
    return this.find({ source, status: 'active' }).sort({ subscribedAt: -1 });
};

NewsletterSubscriberSchema.statics.findVerifiedSubscribers = function () {
    return this.find({
        isVerified: true,
        status: 'active'
    }).sort({ subscribedAt: -1 });
};

NewsletterSubscriberSchema.statics.findHighEngagementSubscribers = function () {
    return this.find({
        status: 'active',
        totalEmailsSent: { $gte: 5 },
        $expr: {
            $gte: [
                { $divide: ['$totalEmailsOpened', '$totalEmailsSent'] },
                0.3
            ]
        }
    }).sort({ subscribedAt: -1 });
};

NewsletterSubscriberSchema.statics.getSubscriberStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                unsubscribed: { $sum: { $cond: [{ $eq: ['$status', 'unsubscribed'] }, 1, 0] } },
                bounced: { $sum: { $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0] } },
                complained: { $sum: { $cond: [{ $eq: ['$status', 'complained'] }, 1, 0] } },
                verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
                totalEmailsSent: { $sum: '$totalEmailsSent' },
                totalEmailsOpened: { $sum: '$totalEmailsOpened' },
                totalEmailsClicked: { $sum: '$totalEmailsClicked' }
            }
        }
    ]);

    const result = stats[0] || {
        total: 0,
        active: 0,
        unsubscribed: 0,
        bounced: 0,
        complained: 0,
        verified: 0,
        totalEmailsSent: 0,
        totalEmailsOpened: 0,
        totalEmailsClicked: 0
    };

    // Calculate rates
    result.openRate = result.totalEmailsSent > 0
        ? ((result.totalEmailsOpened / result.totalEmailsSent) * 100).toFixed(2)
        : 0;
    result.clickRate = result.totalEmailsSent > 0
        ? ((result.totalEmailsClicked / result.totalEmailsSent) * 100).toFixed(2)
        : 0;

    return result;
};

// Instance methods
NewsletterSubscriberSchema.methods.verify = function () {
    this.isVerified = true;
    this.verificationToken = undefined;
    this.verificationExpiresAt = undefined;
    return this.save();
};

NewsletterSubscriberSchema.methods.unsubscribe = function () {
    this.status = 'unsubscribed';
    this.unsubscribedAt = new Date();
    return this.save();
};

NewsletterSubscriberSchema.methods.recordEmailSent = function () {
    this.totalEmailsSent += 1;
    this.lastEmailSentAt = new Date();
    return this.save();
};

NewsletterSubscriberSchema.methods.recordEmailOpened = function () {
    this.totalEmailsOpened += 1;
    return this.save();
};

NewsletterSubscriberSchema.methods.recordEmailClicked = function () {
    this.totalEmailsClicked += 1;
    return this.save();
};

const NewsletterSubscriber = mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);

export default NewsletterSubscriber;
