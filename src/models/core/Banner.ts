import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    mobileImage?: string;
    linkUrl?: string;
    linkText?: string;
    position: 'hero' | 'sidebar' | 'footer' | 'popup' | 'notification';
    sortOrder: number;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
    targetAudience?: {
        userTypes?: string[];
        locations?: string[];
        devices?: string[];
        [key: string]: any;
    };
    clickCount: number;
    impressionCount: number;
    ctr: number; // Click-through rate
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>({
    title: {
        type: String,
        required: [true, 'Tiêu đề banner là bắt buộc'],
        trim: true,
        minlength: [2, 'Tiêu đề phải có ít nhất 2 ký tự'],
        maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: [300, 'Phụ đề không được quá 300 ký tự']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
    },
    image: {
        type: String,
        required: [true, 'Hình ảnh là bắt buộc'],
        trim: true,
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
            'URL hình ảnh không hợp lệ'
        ]
    },
    mobileImage: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
            'URL hình ảnh mobile không hợp lệ'
        ]
    },
    linkUrl: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+/,
            'URL liên kết phải bắt đầu bằng http:// hoặc https://'
        ]
    },
    linkText: {
        type: String,
        trim: true,
        maxlength: [100, 'Văn bản liên kết không được quá 100 ký tự']
    },
    position: {
        type: String,
        required: [true, 'Vị trí banner là bắt buộc'],
        enum: {
            values: ['hero', 'sidebar', 'footer', 'popup', 'notification'],
            message: 'Vị trí phải là hero, sidebar, footer, popup hoặc notification'
        }
    },
    sortOrder: {
        type: Number,
        default: 0,
        min: [0, 'Thứ tự sắp xếp không được âm']
    },
    startDate: {
        type: Date,
        validate: {
            validator: function (this: IBanner, value: Date) {
                if (!value) return true; // Optional field
                if (this.endDate && value >= this.endDate) {
                    return false;
                }
                return true;
            },
            message: 'Ngày bắt đầu phải trước ngày kết thúc'
        }
    },
    endDate: {
        type: Date,
        validate: {
            validator: function (this: IBanner, value: Date) {
                if (!value) return true; // Optional field
                if (this.startDate && value <= this.startDate) {
                    return false;
                }
                return true;
            },
            message: 'Ngày kết thúc phải sau ngày bắt đầu'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    targetAudience: {
        userTypes: [{
            type: String,
            enum: ['admin', 'editor', 'viewer', 'customer'],
            trim: true
        }],
        locations: [{
            type: String,
            trim: true,
            maxlength: [100, 'Mỗi vị trí không được quá 100 ký tự']
        }],
        devices: [{
            type: String,
            enum: ['desktop', 'tablet', 'mobile'],
            trim: true
        }]
    },
    clickCount: {
        type: Number,
        default: 0,
        min: [0, 'Số lần click không được âm']
    },
    impressionCount: {
        type: Number,
        default: 0,
        min: [0, 'Số lần hiển thị không được âm']
    },
    ctr: {
        type: Number,
        default: 0,
        min: [0, 'CTR không được âm'],
        max: [100, 'CTR không được quá 100%']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo là bắt buộc']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
BannerSchema.index({ position: 1 });
BannerSchema.index({ isActive: 1 });
BannerSchema.index({ sortOrder: 1 });
BannerSchema.index({ startDate: 1 });
BannerSchema.index({ endDate: 1 });
BannerSchema.index({ createdBy: 1 });
BannerSchema.index({ createdAt: -1 });

// Compound indexes
BannerSchema.index({ position: 1, isActive: 1 });
BannerSchema.index({ position: 1, sortOrder: 1 });
BannerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

// Virtual for creator
BannerSchema.virtual('creator', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});

// Virtual for CTR display
BannerSchema.virtual('ctrDisplay').get(function () {
    return `${this.ctr.toFixed(2)}%`;
});

// Virtual for status
BannerSchema.virtual('status').get(function () {
    const now = new Date();

    if (!this.isActive) return 'inactive';
    if (this.startDate && now < this.startDate) return 'scheduled';
    if (this.endDate && now > this.endDate) return 'expired';
    return 'active';
});

// Virtual for time remaining
BannerSchema.virtual('timeRemaining').get(function () {
    if (!this.endDate) return null;

    const now = new Date();
    const diffInMs = this.endDate.getTime() - now.getTime();

    if (diffInMs <= 0) return 'Đã hết hạn';

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffInDays > 0) {
        return `${diffInDays} ngày ${diffInHours} giờ`;
    } else if (diffInHours > 0) {
        return `${diffInHours} giờ`;
    } else {
        const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffInMinutes} phút`;
    }
});

// Pre-save middleware to calculate CTR
BannerSchema.pre('save', function (next) {
    if (this.isModified('clickCount') || this.isModified('impressionCount')) {
        if (this.impressionCount > 0) {
            this.ctr = (this.clickCount / this.impressionCount) * 100;
        } else {
            this.ctr = 0;
        }
    }
    next();
});

// Static methods
BannerSchema.statics.findActiveBanners = function () {
    const now = new Date();
    return this.find({
        isActive: true,
        $and: [
            {
                $or: [
                    { startDate: { $exists: false } },
                    { startDate: { $lte: now } }
                ]
            },
            {
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: { $gte: now } }
                ]
            }
        ]
    }).sort({ position: 1, sortOrder: 1 });
};

BannerSchema.statics.findByPosition = function (position: string) {
    const now = new Date();
    return this.find({
        position,
        isActive: true,
        $and: [
            {
                $or: [
                    { startDate: { $exists: false } },
                    { startDate: { $lte: now } }
                ]
            },
            {
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: { $gte: now } }
                ]
            }
        ]
    }).sort({ sortOrder: 1 });
};

BannerSchema.statics.findScheduledBanners = function () {
    const now = new Date();
    return this.find({
        isActive: true,
        startDate: { $gt: now }
    }).sort({ startDate: 1 });
};

BannerSchema.statics.findExpiredBanners = function () {
    const now = new Date();
    return this.find({
        isActive: true,
        endDate: { $lt: now }
    }).sort({ endDate: -1 });
};

BannerSchema.statics.findByCreator = function (creatorId: string) {
    return this.find({ createdBy: creatorId }).sort({ createdAt: -1 });
};

BannerSchema.statics.getBannerStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                active: { $sum: { $cond: ['$isActive', 1, 0] } },
                totalClicks: { $sum: '$clickCount' },
                totalImpressions: { $sum: '$impressionCount' },
                avgCtr: { $avg: '$ctr' }
            }
        }
    ]);

    const result = stats[0] || {
        total: 0,
        active: 0,
        totalClicks: 0,
        totalImpressions: 0,
        avgCtr: 0
    };

    // Calculate overall CTR
    result.overallCtr = result.totalImpressions > 0
        ? ((result.totalClicks / result.totalImpressions) * 100).toFixed(2)
        : 0;

    return result;
};

BannerSchema.statics.getTopPerformingBanners = function (limit: number = 10) {
    return this.find({ isActive: true })
        .sort({ ctr: -1, clickCount: -1 })
        .limit(limit);
};

// Instance methods
BannerSchema.methods.recordImpression = function () {
    this.impressionCount += 1;
    return this.save();
};

BannerSchema.methods.recordClick = function () {
    this.clickCount += 1;
    return this.save();
};

BannerSchema.methods.activate = function () {
    this.isActive = true;
    return this.save();
};

BannerSchema.methods.deactivate = function () {
    this.isActive = false;
    return this.save();
};

BannerSchema.methods.updateSortOrder = function (sortOrder: number) {
    this.sortOrder = sortOrder;
    return this.save();
};

BannerSchema.methods.schedule = function (startDate: Date, endDate?: Date) {
    this.startDate = startDate;
    if (endDate) this.endDate = endDate;
    return this.save();
};

const Banner = mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
