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
const NewsletterCampaignSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Tên campaign là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên campaign phải có ít nhất 2 ký tự'],
        maxlength: [200, 'Tên campaign không được quá 200 ký tự']
    },
    subject: {
        type: String,
        required: [true, 'Tiêu đề email là bắt buộc'],
        trim: true,
        minlength: [5, 'Tiêu đề phải có ít nhất 5 ký tự'],
        maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
    },
    content: {
        type: String,
        required: [true, 'Nội dung email là bắt buộc'],
        minlength: [10, 'Nội dung phải có ít nhất 10 ký tự']
    },
    templateId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'EmailTemplate'
    },
    recipients: {
        total: {
            type: Number,
            default: 0,
            min: [0, 'Tổng người nhận không được âm']
        },
        sent: {
            type: Number,
            default: 0,
            min: [0, 'Số email đã gửi không được âm']
        },
        delivered: {
            type: Number,
            default: 0,
            min: [0, 'Số email đã giao không được âm']
        },
        opened: {
            type: Number,
            default: 0,
            min: [0, 'Số email đã mở không được âm']
        },
        clicked: {
            type: Number,
            default: 0,
            min: [0, 'Số email đã click không được âm']
        },
        bounced: {
            type: Number,
            default: 0,
            min: [0, 'Số email bị trả về không được âm']
        },
        unsubscribed: {
            type: Number,
            default: 0,
            min: [0, 'Số người hủy đăng ký không được âm']
        },
        complained: {
            type: Number,
            default: 0,
            min: [0, 'Số người phàn nàn không được âm']
        }
    },
    status: {
        type: String,
        required: [true, 'Trạng thái campaign là bắt buộc'],
        enum: {
            values: ['draft', 'scheduled', 'sending', 'sent', 'cancelled', 'failed'],
            message: 'Trạng thái phải là draft, scheduled, sending, sent, cancelled hoặc failed'
        },
        default: 'draft'
    },
    scheduledAt: {
        type: Date,
        validate: {
            validator: function (value) {
                if (this.status === 'scheduled' && !value) {
                    return false;
                }
                if (value && value <= new Date()) {
                    return false;
                }
                return true;
            },
            message: 'Ngày lên lịch phải trong tương lai'
        }
    },
    sentAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo là bắt buộc']
    },
    targetAudience: {
        interests: [{
                type: String,
                trim: true,
                maxlength: [50, 'Mỗi sở thích không được quá 50 ký tự']
            }],
        sources: [{
                type: String,
                enum: ['website', 'facebook', 'google', 'referral', 'other']
            }],
        tags: [{
                type: String,
                trim: true,
                maxlength: [50, 'Mỗi tag không được quá 50 ký tự']
            }],
        subscribedAfter: {
            type: Date
        },
        subscribedBefore: {
            type: Date
        }
    },
    settings: {
        trackOpens: {
            type: Boolean,
            default: true
        },
        trackClicks: {
            type: Boolean,
            default: true
        },
        trackUnsubscribes: {
            type: Boolean,
            default: true
        },
        fromName: {
            type: String,
            required: [true, 'Tên người gửi là bắt buộc'],
            trim: true,
            maxlength: [100, 'Tên người gửi không được quá 100 ký tự']
        },
        fromEmail: {
            type: String,
            required: [true, 'Email người gửi là bắt buộc'],
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Email người gửi không hợp lệ'
            ]
        },
        replyToEmail: {
            type: String,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Email phản hồi không hợp lệ'
            ]
        }
    },
    analytics: {
        openRate: {
            type: Number,
            default: 0,
            min: [0, 'Tỷ lệ mở không được âm'],
            max: [100, 'Tỷ lệ mở không được quá 100%']
        },
        clickRate: {
            type: Number,
            default: 0,
            min: [0, 'Tỷ lệ click không được âm'],
            max: [100, 'Tỷ lệ click không được quá 100%']
        },
        bounceRate: {
            type: Number,
            default: 0,
            min: [0, 'Tỷ lệ bounce không được âm'],
            max: [100, 'Tỷ lệ bounce không được quá 100%']
        },
        unsubscribeRate: {
            type: Number,
            default: 0,
            min: [0, 'Tỷ lệ hủy đăng ký không được âm'],
            max: [100, 'Tỷ lệ hủy đăng ký không được quá 100%']
        },
        complaintRate: {
            type: Number,
            default: 0,
            min: [0, 'Tỷ lệ phàn nàn không được âm'],
            max: [100, 'Tỷ lệ phàn nàn không được quá 100%']
        },
        engagementScore: {
            type: Number,
            default: 0,
            min: [0, 'Điểm tương tác không được âm'],
            max: [100, 'Điểm tương tác không được quá 100']
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
NewsletterCampaignSchema.index({ name: 1 });
NewsletterCampaignSchema.index({ status: 1 });
NewsletterCampaignSchema.index({ createdBy: 1 });
NewsletterCampaignSchema.index({ scheduledAt: 1 });
NewsletterCampaignSchema.index({ sentAt: -1 });
NewsletterCampaignSchema.index({ createdAt: -1 });
NewsletterCampaignSchema.index({ status: 1, scheduledAt: 1 });
NewsletterCampaignSchema.index({ createdBy: 1, status: 1 });
NewsletterCampaignSchema.index({ status: 1, sentAt: -1 });
NewsletterCampaignSchema.virtual('creator', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});
NewsletterCampaignSchema.virtual('template', {
    ref: 'EmailTemplate',
    localField: 'templateId',
    foreignField: '_id',
    justOne: true
});
NewsletterCampaignSchema.virtual('deliveryRate').get(function () {
    if (this.recipients.sent === 0)
        return 0;
    return ((this.recipients.delivered / this.recipients.sent) * 100).toFixed(2);
});
NewsletterCampaignSchema.virtual('isCompleted').get(function () {
    return this.status === 'sent' && this.recipients.sent === this.recipients.total;
});
NewsletterCampaignSchema.virtual('progressPercentage').get(function () {
    if (this.recipients.total === 0)
        return 0;
    return ((this.recipients.sent / this.recipients.total) * 100).toFixed(1);
});
NewsletterCampaignSchema.pre('save', function (next) {
    if (this.isModified('recipients')) {
        const { sent, delivered, opened, clicked, bounced, unsubscribed, complained } = this.recipients;
        if (sent > 0) {
            this.analytics.openRate = ((opened / sent) * 100);
            this.analytics.clickRate = ((clicked / sent) * 100);
            this.analytics.bounceRate = ((bounced / sent) * 100);
            this.analytics.unsubscribeRate = ((unsubscribed / sent) * 100);
            this.analytics.complaintRate = ((complained / sent) * 100);
            this.analytics.engagementScore = (this.analytics.openRate * 0.3 +
                this.analytics.clickRate * 0.7);
        }
    }
    next();
});
NewsletterCampaignSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'sent' && !this.sentAt) {
        this.sentAt = new Date();
    }
    if (this.isModified('status') && this.status === 'sent' && this.recipients.sent === this.recipients.total && !this.completedAt) {
        this.completedAt = new Date();
    }
    next();
});
NewsletterCampaignSchema.statics.findActiveCampaigns = function () {
    return this.find({
        status: { $in: ['draft', 'scheduled', 'sending'] }
    }).sort({ createdAt: -1 });
};
NewsletterCampaignSchema.statics.findScheduledCampaigns = function () {
    return this.find({
        status: 'scheduled',
        scheduledAt: { $lte: new Date() }
    }).sort({ scheduledAt: 1 });
};
NewsletterCampaignSchema.statics.findSentCampaigns = function () {
    return this.find({ status: 'sent' }).sort({ sentAt: -1 });
};
NewsletterCampaignSchema.statics.findByCreator = function (creatorId) {
    return this.find({ createdBy: creatorId }).sort({ createdAt: -1 });
};
NewsletterCampaignSchema.statics.getCampaignStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
                scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
                sending: { $sum: { $cond: [{ $eq: ['$status', 'sending'] }, 1, 0] } },
                sent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
                cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
                totalRecipients: { $sum: '$recipients.total' },
                totalSent: { $sum: '$recipients.sent' },
                totalOpened: { $sum: '$recipients.opened' },
                totalClicked: { $sum: '$recipients.clicked' },
                avgOpenRate: { $avg: '$analytics.openRate' },
                avgClickRate: { $avg: '$analytics.clickRate' }
            }
        }
    ]);
    return stats[0] || {
        total: 0,
        draft: 0,
        scheduled: 0,
        sending: 0,
        sent: 0,
        cancelled: 0,
        failed: 0,
        totalRecipients: 0,
        totalSent: 0,
        totalOpened: 0,
        totalClicked: 0,
        avgOpenRate: 0,
        avgClickRate: 0
    };
};
NewsletterCampaignSchema.methods.schedule = function (scheduledAt) {
    this.status = 'scheduled';
    this.scheduledAt = scheduledAt;
    return this.save();
};
NewsletterCampaignSchema.methods.startSending = function () {
    this.status = 'sending';
    return this.save();
};
NewsletterCampaignSchema.methods.markAsSent = function () {
    this.status = 'sent';
    this.sentAt = new Date();
    if (this.recipients.sent === this.recipients.total) {
        this.completedAt = new Date();
    }
    return this.save();
};
NewsletterCampaignSchema.methods.cancel = function () {
    this.status = 'cancelled';
    return this.save();
};
NewsletterCampaignSchema.methods.updateRecipients = function (updates) {
    Object.assign(this.recipients, updates);
    return this.save();
};
const NewsletterCampaign = mongoose_1.default.model('NewsletterCampaign', NewsletterCampaignSchema);
exports.default = NewsletterCampaign;
