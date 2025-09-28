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
const AnalyticsDataSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: [true, 'Ngày là bắt buộc']
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
AnalyticsDataSchema.index({ date: 1 });
AnalyticsDataSchema.index({ metric: 1 });
AnalyticsDataSchema.index({ source: 1 });
AnalyticsDataSchema.index({ category: 1 });
AnalyticsDataSchema.index({ isProcessed: 1 });
AnalyticsDataSchema.index({ 'dimensions.source': 1 });
AnalyticsDataSchema.index({ 'dimensions.device': 1 });
AnalyticsDataSchema.index({ 'dimensions.country': 1 });
AnalyticsDataSchema.index({ 'dimensions.page': 1 });
AnalyticsDataSchema.index({ date: 1, metric: 1 });
AnalyticsDataSchema.index({ category: 1, date: 1 });
AnalyticsDataSchema.index({ source: 1, date: 1 });
AnalyticsDataSchema.index({ metric: 1, 'dimensions.source': 1 });
AnalyticsDataSchema.index({ date: 1, category: 1, metric: 1 });
AnalyticsDataSchema.index({ date: 1 }, { expireAfterSeconds: 2 * 365 * 24 * 60 * 60 });
AnalyticsDataSchema.virtual('dateDisplay').get(function () {
    return this.date.toLocaleDateString('vi-VN');
});
AnalyticsDataSchema.virtual('valueDisplay').get(function () {
    if (this.value >= 1000000) {
        return `${(this.value / 1000000).toFixed(1)}M`;
    }
    else if (this.value >= 1000) {
        return `${(this.value / 1000).toFixed(1)}K`;
    }
    return this.value.toString();
});
AnalyticsDataSchema.statics.findByMetric = function (metric, startDate, endDate) {
    const query = { metric };
    if (startDate || endDate) {
        query.date = {};
        if (startDate)
            query.date.$gte = startDate;
        if (endDate)
            query.date.$lte = endDate;
    }
    return this.find(query).sort({ date: -1 });
};
AnalyticsDataSchema.statics.findByCategory = function (category, startDate, endDate) {
    const query = { category };
    if (startDate || endDate) {
        query.date = {};
        if (startDate)
            query.date.$gte = startDate;
        if (endDate)
            query.date.$lte = endDate;
    }
    return this.find(query).sort({ date: -1 });
};
AnalyticsDataSchema.statics.findBySource = function (source, startDate, endDate) {
    const query = { source };
    if (startDate || endDate) {
        query.date = {};
        if (startDate)
            query.date.$gte = startDate;
        if (endDate)
            query.date.$lte = endDate;
    }
    return this.find(query).sort({ date: -1 });
};
AnalyticsDataSchema.statics.findByDimension = function (dimension, value, startDate, endDate) {
    const query = { [`dimensions.${dimension}`]: value };
    if (startDate || endDate) {
        query.date = {};
        if (startDate)
            query.date.$gte = startDate;
        if (endDate)
            query.date.$lte = endDate;
    }
    return this.find(query).sort({ date: -1 });
};
AnalyticsDataSchema.statics.getMetricSummary = async function (metric, startDate, endDate) {
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
AnalyticsDataSchema.statics.getTrafficSources = async function (startDate, endDate) {
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
AnalyticsDataSchema.statics.getDeviceStats = async function (startDate, endDate) {
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
AnalyticsDataSchema.statics.getCountryStats = async function (startDate, endDate) {
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
AnalyticsDataSchema.statics.getPageViews = async function (startDate, endDate) {
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
AnalyticsDataSchema.statics.getConversionMetrics = async function (startDate, endDate) {
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
AnalyticsDataSchema.statics.getRevenueMetrics = async function (startDate, endDate) {
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
AnalyticsDataSchema.statics.getDailyTrends = async function (metric, startDate, endDate) {
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
AnalyticsDataSchema.statics.getHourlyTrends = async function (metric, date) {
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
AnalyticsDataSchema.methods.addDimension = function (key, value) {
    this.dimensions[key] = value;
    return this.save();
};
AnalyticsDataSchema.methods.updateValue = function (value) {
    this.value = value;
    return this.save();
};
AnalyticsDataSchema.methods.markAsProcessed = function () {
    this.isProcessed = true;
    return this.save();
};
const AnalyticsData = mongoose_1.default.model('AnalyticsData', AnalyticsDataSchema);
exports.default = AnalyticsData;
