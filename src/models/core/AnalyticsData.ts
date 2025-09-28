import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsData extends Document {
    date: Date;
    metric: string;
    value: number;
    dimensions: {
        source?: string;
        medium?: string;
        campaign?: string;
        device?: string;
        browser?: string;
        os?: string;
        country?: string;
        city?: string;
        page?: string;
        userType?: string;
        [key: string]: any;
    };
    source: 'google_analytics' | 'internal' | 'facebook' | 'manual';
    category: 'traffic' | 'conversion' | 'engagement' | 'revenue' | 'user_behavior' | 'performance';
    isProcessed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AnalyticsDataSchema = new Schema<IAnalyticsData>({
    date: {
        type: Date,
        required: [true, 'Ngày là bắt buộc']
        // Note: index is created manually below for better control
    },
    metric: {
        type: String,
        required: [true, 'Metric là bắt buộc'],
        trim: true,
        maxlength: [100, 'Metric không được quá 100 ký tự']
    },
    value: {
        type: Number,
        required: [true, 'Giá trị là bắt buộc'],
        min: [0, 'Giá trị không được âm']
    },
    dimensions: {
        source: {
            type: String,
            trim: true,
            maxlength: [100, 'Nguồn không được quá 100 ký tự']
        },
        medium: {
            type: String,
            trim: true,
            maxlength: [100, 'Phương tiện không được quá 100 ký tự']
        },
        campaign: {
            type: String,
            trim: true,
            maxlength: [100, 'Chiến dịch không được quá 100 ký tự']
        },
        device: {
            type: String,
            trim: true,
            maxlength: [50, 'Thiết bị không được quá 50 ký tự']
        },
        browser: {
            type: String,
            trim: true,
            maxlength: [50, 'Trình duyệt không được quá 50 ký tự']
        },
        os: {
            type: String,
            trim: true,
            maxlength: [50, 'Hệ điều hành không được quá 50 ký tự']
        },
        country: {
            type: String,
            trim: true,
            maxlength: [100, 'Quốc gia không được quá 100 ký tự']
        },
        city: {
            type: String,
            trim: true,
            maxlength: [100, 'Thành phố không được quá 100 ký tự']
        },
        page: {
            type: String,
            trim: true,
            maxlength: [500, 'Trang không được quá 500 ký tự']
        },
        userType: {
            type: String,
            trim: true,
            maxlength: [50, 'Loại người dùng không được quá 50 ký tự']
        }
    },
    source: {
        type: String,
        required: [true, 'Nguồn dữ liệu là bắt buộc'],
        enum: {
            values: ['google_analytics', 'internal', 'facebook', 'manual'],
            message: 'Nguồn dữ liệu phải là google_analytics, internal, facebook hoặc manual'
        }
    },
    category: {
        type: String,
        required: [true, 'Danh mục là bắt buộc'],
        enum: {
            values: ['traffic', 'conversion', 'engagement', 'revenue', 'user_behavior', 'performance'],
            message: 'Danh mục phải là traffic, conversion, engagement, revenue, user_behavior hoặc performance'
        }
    },
    isProcessed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
AnalyticsDataSchema.index({ date: 1 });
AnalyticsDataSchema.index({ metric: 1 });
AnalyticsDataSchema.index({ source: 1 });
AnalyticsDataSchema.index({ category: 1 });
AnalyticsDataSchema.index({ isProcessed: 1 });
AnalyticsDataSchema.index({ 'dimensions.source': 1 });
AnalyticsDataSchema.index({ 'dimensions.device': 1 });
AnalyticsDataSchema.index({ 'dimensions.country': 1 });
AnalyticsDataSchema.index({ 'dimensions.page': 1 });

// Compound indexes
AnalyticsDataSchema.index({ date: 1, metric: 1 });
AnalyticsDataSchema.index({ category: 1, date: 1 });
AnalyticsDataSchema.index({ source: 1, date: 1 });
AnalyticsDataSchema.index({ metric: 1, 'dimensions.source': 1 });
AnalyticsDataSchema.index({ date: 1, category: 1, metric: 1 });

// TTL index for automatic cleanup (keep data for 2 years)
AnalyticsDataSchema.index({ date: 1 }, { expireAfterSeconds: 2 * 365 * 24 * 60 * 60 });

// Virtual for date display
AnalyticsDataSchema.virtual('dateDisplay').get(function () {
    return this.date.toLocaleDateString('vi-VN');
});

// Virtual for value display
AnalyticsDataSchema.virtual('valueDisplay').get(function () {
    if (this.value >= 1000000) {
        return `${(this.value / 1000000).toFixed(1)}M`;
    } else if (this.value >= 1000) {
        return `${(this.value / 1000).toFixed(1)}K`;
    }
    return this.value.toString();
});

// Static methods
AnalyticsDataSchema.statics.findByMetric = function (metric: string, startDate?: Date, endDate?: Date) {
    const query: any = { metric };
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
    }
    return this.find(query).sort({ date: -1 });
};

AnalyticsDataSchema.statics.findByCategory = function (category: string, startDate?: Date, endDate?: Date) {
    const query: any = { category };
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
    }
    return this.find(query).sort({ date: -1 });
};

AnalyticsDataSchema.statics.findBySource = function (source: string, startDate?: Date, endDate?: Date) {
    const query: any = { source };
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
    }
    return this.find(query).sort({ date: -1 });
};

AnalyticsDataSchema.statics.findByDimension = function (dimension: string, value: string, startDate?: Date, endDate?: Date) {
    const query: any = { [`dimensions.${dimension}`]: value };
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
    }
    return this.find(query).sort({ date: -1 });
};

AnalyticsDataSchema.statics.getMetricSummary = async function (metric: string, startDate: Date, endDate: Date) {
    const summary = await this.aggregate([
        {
            $match: {
                metric,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$value' },
                average: { $avg: '$value' },
                min: { $min: '$value' },
                max: { $max: '$value' },
                count: { $sum: 1 }
            }
        }
    ]);

    return summary[0] || {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        count: 0
    };
};

AnalyticsDataSchema.statics.getTrafficSources = async function (startDate: Date, endDate: Date) {
    return this.aggregate([
        {
            $match: {
                category: 'traffic',
                metric: 'sessions',
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    source: '$dimensions.source',
                    medium: '$dimensions.medium'
                },
                sessions: { $sum: '$value' }
            }
        },
        {
            $sort: { sessions: -1 }
        },
        {
            $limit: 20
        }
    ]);
};

AnalyticsDataSchema.statics.getDeviceStats = async function (startDate: Date, endDate: Date) {
    return this.aggregate([
        {
            $match: {
                category: 'traffic',
                metric: 'sessions',
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$dimensions.device',
                sessions: { $sum: '$value' }
            }
        },
        {
            $sort: { sessions: -1 }
        }
    ]);
};

AnalyticsDataSchema.statics.getCountryStats = async function (startDate: Date, endDate: Date) {
    return this.aggregate([
        {
            $match: {
                category: 'traffic',
                metric: 'sessions',
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$dimensions.country',
                sessions: { $sum: '$value' }
            }
        },
        {
            $sort: { sessions: -1 }
        },
        {
            $limit: 20
        }
    ]);
};

AnalyticsDataSchema.statics.getPageViews = async function (startDate: Date, endDate: Date) {
    return this.aggregate([
        {
            $match: {
                category: 'traffic',
                metric: 'pageviews',
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$dimensions.page',
                pageviews: { $sum: '$value' }
            }
        },
        {
            $sort: { pageviews: -1 }
        },
        {
            $limit: 20
        }
    ]);
};

AnalyticsDataSchema.statics.getConversionMetrics = async function (startDate: Date, endDate: Date) {
    return this.aggregate([
        {
            $match: {
                category: 'conversion',
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$metric',
                value: { $sum: '$value' }
            }
        },
        {
            $sort: { value: -1 }
        }
    ]);
};

AnalyticsDataSchema.statics.getRevenueMetrics = async function (startDate: Date, endDate: Date) {
    return this.aggregate([
        {
            $match: {
                category: 'revenue',
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$metric',
                value: { $sum: '$value' }
            }
        },
        {
            $sort: { value: -1 }
        }
    ]);
};

AnalyticsDataSchema.statics.getDailyTrends = async function (metric: string, startDate: Date, endDate: Date) {
    return this.aggregate([
        {
            $match: {
                metric,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    day: { $dayOfMonth: '$date' }
                },
                value: { $sum: '$value' }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
    ]);
};

AnalyticsDataSchema.statics.getHourlyTrends = async function (metric: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.aggregate([
        {
            $match: {
                metric,
                date: { $gte: startOfDay, $lte: endOfDay }
            }
        },
        {
            $group: {
                _id: { $hour: '$date' },
                value: { $sum: '$value' }
            }
        },
        {
            $sort: { '_id': 1 }
        }
    ]);
};

// Instance methods
AnalyticsDataSchema.methods.addDimension = function (key: string, value: string) {
    this.dimensions[key] = value;
    return this.save();
};

AnalyticsDataSchema.methods.updateValue = function (value: number) {
    this.value = value;
    return this.save();
};

AnalyticsDataSchema.methods.markAsProcessed = function () {
    this.isProcessed = true;
    return this.save();
};

const AnalyticsData = mongoose.model<IAnalyticsData>('AnalyticsData', AnalyticsDataSchema);

export default AnalyticsData;
