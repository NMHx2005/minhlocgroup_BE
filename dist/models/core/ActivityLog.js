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
const ActivityLogSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        required: [true, 'Hành động là bắt buộc'],
        trim: true,
        maxlength: [100, 'Hành động không được quá 100 ký tự']
    },
    resourceType: {
        type: String,
        required: [true, 'Loại tài nguyên là bắt buộc'],
        trim: true,
        maxlength: [50, 'Loại tài nguyên không được quá 50 ký tự']
    },
    resourceId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    description: {
        type: String,
        required: [true, 'Mô tả là bắt buộc'],
        trim: true,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },
    details: {
        type: mongoose_1.Schema.Types.Mixed
    },
    ipAddress: {
        type: String,
        required: [true, 'Địa chỉ IP là bắt buộc'],
        trim: true,
        match: [
            /^(?:(?:25[0-5]|2[0-4][\d]|[01]?[\d][\d]?)\.){3}(?:25[0-5]|2[0-4][\d]|[01]?[\d][\d]?)$/,
            'Địa chỉ IP không hợp lệ'
        ]
    },
    userAgent: {
        type: String,
        required: [true, 'User agent là bắt buộc'],
        trim: true,
        maxlength: [500, 'User agent không được quá 500 ký tự']
    },
    location: {
        country: {
            type: String,
            trim: true,
            maxlength: [100, 'Tên quốc gia không được quá 100 ký tự']
        },
        region: {
            type: String,
            trim: true,
            maxlength: [100, 'Tên vùng không được quá 100 ký tự']
        },
        city: {
            type: String,
            trim: true,
            maxlength: [100, 'Tên thành phố không được quá 100 ký tự']
        },
        coordinates: {
            latitude: {
                type: Number,
                min: [-90, 'Vĩ độ phải từ -90 đến 90'],
                max: [90, 'Vĩ độ phải từ -90 đến 90']
            },
            longitude: {
                type: Number,
                min: [-180, 'Kinh độ phải từ -180 đến 180'],
                max: [180, 'Kinh độ phải từ -180 đến 180']
            }
        }
    },
    sessionId: {
        type: String,
        trim: true,
        maxlength: [100, 'Session ID không được quá 100 ký tự']
    },
    isSuccess: {
        type: Boolean,
        default: true
    },
    errorMessage: {
        type: String,
        trim: true,
        maxlength: [500, 'Thông báo lỗi không được quá 500 ký tự']
    },
    duration: {
        type: Number,
        min: [0, 'Thời gian thực hiện không được âm']
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed
    }
}, {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
ActivityLogSchema.index({ userId: 1 });
ActivityLogSchema.index({ action: 1 });
ActivityLogSchema.index({ resourceType: 1 });
ActivityLogSchema.index({ resourceId: 1 });
ActivityLogSchema.index({ ipAddress: 1 });
ActivityLogSchema.index({ sessionId: 1 });
ActivityLogSchema.index({ isSuccess: 1 });
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ resourceType: 1, resourceId: 1 });
ActivityLogSchema.index({ isSuccess: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, action: 1 });
ActivityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });
ActivityLogSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});
ActivityLogSchema.virtual('timeAgo').get(function () {
    const now = new Date();
    const diffInMs = now.getTime() - this.createdAt.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays > 0) {
        return `${diffInDays} ngày trước`;
    }
    else if (diffInHours > 0) {
        return `${diffInHours} giờ trước`;
    }
    else if (diffInMinutes > 0) {
        return `${diffInMinutes} phút trước`;
    }
    else {
        return 'Vừa xong';
    }
});
ActivityLogSchema.virtual('locationDisplay').get(function () {
    if (!this.location)
        return null;
    const parts = [];
    if (this.location.city)
        parts.push(this.location.city);
    if (this.location.region)
        parts.push(this.location.region);
    if (this.location.country)
        parts.push(this.location.country);
    return parts.join(', ') || null;
});
ActivityLogSchema.statics.findByUser = function (userId, limit = 50) {
    return this.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};
ActivityLogSchema.statics.findByAction = function (action, limit = 50) {
    return this.find({ action }).sort({ createdAt: -1 }).limit(limit);
};
ActivityLogSchema.statics.findByResource = function (resourceType, resourceId) {
    return this.find({ resourceType, resourceId }).sort({ createdAt: -1 });
};
ActivityLogSchema.statics.findByIP = function (ipAddress, limit = 50) {
    return this.find({ ipAddress }).sort({ createdAt: -1 }).limit(limit);
};
ActivityLogSchema.statics.findBySession = function (sessionId) {
    return this.find({ sessionId }).sort({ createdAt: -1 });
};
ActivityLogSchema.statics.findFailedActions = function (limit = 50) {
    return this.find({ isSuccess: false }).sort({ createdAt: -1 }).limit(limit);
};
ActivityLogSchema.statics.findRecentActivity = function (hours = 24, limit = 100) {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    return this.find({
        createdAt: { $gte: cutoffDate }
    }).sort({ createdAt: -1 }).limit(limit);
};
ActivityLogSchema.statics.getUserActivityStats = async function (userId, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const stats = await this.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(userId),
                createdAt: { $gte: cutoffDate }
            }
        },
        {
            $group: {
                _id: null,
                totalActions: { $sum: 1 },
                successfulActions: { $sum: { $cond: ['$isSuccess', 1, 0] } },
                failedActions: { $sum: { $cond: [{ $eq: ['$isSuccess', false] }, 1, 0] } },
                uniqueActions: { $addToSet: '$action' },
                avgDuration: { $avg: '$duration' },
                totalDuration: { $sum: '$duration' }
            }
        },
        {
            $project: {
                totalActions: 1,
                successfulActions: 1,
                failedActions: 1,
                actionCount: { $size: '$uniqueActions' },
                successRate: {
                    $cond: [
                        { $gt: ['$totalActions', 0] },
                        { $multiply: [{ $divide: ['$successfulActions', '$totalActions'] }, 100] },
                        0
                    ]
                },
                avgDuration: 1,
                totalDuration: 1
            }
        }
    ]);
    return stats[0] || {
        totalActions: 0,
        successfulActions: 0,
        failedActions: 0,
        actionCount: 0,
        successRate: 0,
        avgDuration: 0,
        totalDuration: 0
    };
};
ActivityLogSchema.statics.getSystemStats = async function (days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const stats = await this.aggregate([
        {
            $match: {
                createdAt: { $gte: cutoffDate }
            }
        },
        {
            $group: {
                _id: null,
                totalLogs: { $sum: 1 },
                uniqueUsers: { $addToSet: '$userId' },
                uniqueIPs: { $addToSet: '$ipAddress' },
                successfulActions: { $sum: { $cond: ['$isSuccess', 1, 0] } },
                failedActions: { $sum: { $cond: [{ $eq: ['$isSuccess', false] }, 1, 0] } },
                avgDuration: { $avg: '$duration' }
            }
        },
        {
            $project: {
                totalLogs: 1,
                uniqueUserCount: { $size: '$uniqueUsers' },
                uniqueIPCount: { $size: '$uniqueIPs' },
                successfulActions: 1,
                failedActions: 1,
                successRate: {
                    $cond: [
                        { $gt: ['$totalLogs', 0] },
                        { $multiply: [{ $divide: ['$successfulActions', '$totalLogs'] }, 100] },
                        0
                    ]
                },
                avgDuration: 1
            }
        }
    ]);
    return stats[0] || {
        totalLogs: 0,
        uniqueUserCount: 0,
        uniqueIPCount: 0,
        successfulActions: 0,
        failedActions: 0,
        successRate: 0,
        avgDuration: 0
    };
};
ActivityLogSchema.statics.getActionFrequency = async function (days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return this.aggregate([
        {
            $match: {
                createdAt: { $gte: cutoffDate }
            }
        },
        {
            $group: {
                _id: '$action',
                count: { $sum: 1 },
                successCount: { $sum: { $cond: ['$isSuccess', 1, 0] } },
                avgDuration: { $avg: '$duration' }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 20
        }
    ]);
};
ActivityLogSchema.methods.markAsFailed = function (errorMessage) {
    this.isSuccess = false;
    this.errorMessage = errorMessage;
    return this.save();
};
ActivityLogSchema.methods.setDuration = function (duration) {
    this.duration = duration;
    return this.save();
};
ActivityLogSchema.methods.addMetadata = function (metadata) {
    this.metadata = { ...this.metadata, ...metadata };
    return this.save();
};
const ActivityLog = mongoose_1.default.model('ActivityLog', ActivityLogSchema);
exports.default = ActivityLog;
