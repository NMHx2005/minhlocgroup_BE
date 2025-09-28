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
const ContactMessageSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Tên người gửi là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
        maxlength: [100, 'Tên không được quá 100 ký tự']
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Email không hợp lệ'
        ]
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (phone) {
                if (!phone)
                    return true;
                const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
                return phoneRegex.test(phone);
            },
            message: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ'
        }
    },
    subject: {
        type: String,
        required: [true, 'Tiêu đề là bắt buộc'],
        trim: true,
        minlength: [5, 'Tiêu đề phải có ít nhất 5 ký tự'],
        maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
    },
    message: {
        type: String,
        required: [true, 'Nội dung tin nhắn là bắt buộc'],
        trim: true,
        minlength: [10, 'Nội dung phải có ít nhất 10 ký tự'],
        maxlength: [2000, 'Nội dung không được quá 2000 ký tự']
    },
    status: {
        type: String,
        required: [true, 'Trạng thái là bắt buộc'],
        enum: {
            values: ['new', 'in_progress', 'resolved', 'closed'],
            message: 'Trạng thái phải là new, in_progress, resolved hoặc closed'
        },
        default: 'new'
    },
    priority: {
        type: String,
        required: [true, 'Mức độ ưu tiên là bắt buộc'],
        enum: {
            values: ['low', 'medium', 'high', 'urgent'],
            message: 'Mức độ ưu tiên phải là low, medium, high hoặc urgent'
        },
        default: 'medium'
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reply: {
        message: {
            type: String,
            trim: true,
            maxlength: [2000, 'Nội dung phản hồi không được quá 2000 ký tự']
        },
        repliedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        },
        repliedAt: {
            type: Date
        }
    },
    source: {
        type: String,
        required: [true, 'Nguồn tin nhắn là bắt buộc'],
        enum: {
            values: ['website', 'email', 'phone', 'social', 'other'],
            message: 'Nguồn phải là website, email, phone, social hoặc other'
        },
        default: 'website'
    },
    ipAddress: {
        type: String,
        trim: true,
        validate: {
            validator: function (ip) {
                if (!ip)
                    return true;
                const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
                const localhostRegex = /^(localhost|127\.0\.0\.1|::1)$/;
                return ipv4Regex.test(ip) || ipv6Regex.test(ip) || localhostRegex.test(ip);
            },
            message: 'Địa chỉ IP không hợp lệ'
        }
    },
    userAgent: {
        type: String,
        trim: true,
        maxlength: [500, 'User agent không được quá 500 ký tự']
    },
    attachments: [{
            type: String,
            trim: true,
            match: [
                /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|pdf|doc|docx|txt)$/i,
                'URL file đính kèm không hợp lệ'
            ]
        }],
    tags: [{
            type: String,
            trim: true,
            maxlength: [50, 'Mỗi tag không được quá 50 ký tự']
        }],
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Ghi chú không được quá 1000 ký tự']
    },
    followUpDate: {
        type: Date,
        validate: {
            validator: function (value) {
                if (!value)
                    return true;
                return value > new Date();
            },
            message: 'Ngày theo dõi phải trong tương lai'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
ContactMessageSchema.index({ email: 1 });
ContactMessageSchema.index({ status: 1 });
ContactMessageSchema.index({ priority: 1 });
ContactMessageSchema.index({ assignedTo: 1 });
ContactMessageSchema.index({ source: 1 });
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ followUpDate: 1 });
ContactMessageSchema.index({ tags: 1 });
ContactMessageSchema.index({ status: 1, priority: 1 });
ContactMessageSchema.index({ assignedTo: 1, status: 1 });
ContactMessageSchema.index({ status: 1, createdAt: -1 });
ContactMessageSchema.index({ priority: 1, createdAt: -1 });
ContactMessageSchema.virtual('assignedUser', {
    ref: 'User',
    localField: 'assignedTo',
    foreignField: '_id',
    justOne: true
});
ContactMessageSchema.virtual('repliedByUser', {
    ref: 'User',
    localField: 'reply.repliedBy',
    foreignField: '_id',
    justOne: true
});
ContactMessageSchema.virtual('timeSinceCreation').get(function () {
    const now = new Date();
    const diffInMs = now.getTime() - this.createdAt.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays > 0) {
        return `${diffInDays} ngày trước`;
    }
    else if (diffInHours > 0) {
        return `${diffInHours} giờ trước`;
    }
    else {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} phút trước`;
    }
});
ContactMessageSchema.virtual('statusDisplay').get(function () {
    const statusMap = {
        'new': 'Mới',
        'in_progress': 'Đang xử lý',
        'resolved': 'Đã giải quyết',
        'closed': 'Đã đóng'
    };
    return statusMap[this.status] || this.status;
});
ContactMessageSchema.virtual('priorityDisplay').get(function () {
    const priorityMap = {
        'low': 'Thấp',
        'medium': 'Trung bình',
        'high': 'Cao',
        'urgent': 'Khẩn cấp'
    };
    return priorityMap[this.priority] || this.priority;
});
ContactMessageSchema.pre('save', function (next) {
    if (this.isNew && !this.followUpDate) {
        const now = new Date();
        switch (this.priority) {
            case 'urgent':
                this.followUpDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                break;
            case 'high':
                this.followUpDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
                break;
            case 'medium':
                this.followUpDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'low':
                this.followUpDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
                break;
        }
    }
    next();
});
ContactMessageSchema.statics.findNewMessages = function () {
    return this.find({ status: 'new' }).sort({ priority: -1, createdAt: -1 });
};
ContactMessageSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort({ createdAt: -1 });
};
ContactMessageSchema.statics.findByPriority = function (priority) {
    return this.find({ priority }).sort({ createdAt: -1 });
};
ContactMessageSchema.statics.findByAssignedUser = function (userId) {
    return this.find({ assignedTo: userId }).sort({ createdAt: -1 });
};
ContactMessageSchema.statics.findOverdueMessages = function () {
    return this.find({
        followUpDate: { $lt: new Date() },
        status: { $in: ['new', 'in_progress'] }
    }).sort({ followUpDate: 1 });
};
ContactMessageSchema.statics.findMessagesNeedingFollowUp = function () {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.find({
        followUpDate: { $lte: tomorrow },
        status: { $in: ['new', 'in_progress'] }
    }).sort({ followUpDate: 1 });
};
ContactMessageSchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
                resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
                urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
                high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
                medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
                low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
            }
        }
    ]);
    return stats[0] || {
        total: 0,
        new: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0
    };
};
ContactMessageSchema.methods.markAsResolved = function (resolvedBy) {
    this.status = 'resolved';
    this.reply = {
        message: 'Tin nhắn đã được giải quyết',
        repliedBy: resolvedBy,
        repliedAt: new Date()
    };
    return this.save();
};
ContactMessageSchema.methods.assignTo = function (userId) {
    this.assignedTo = userId;
    this.status = 'in_progress';
    return this.save();
};
ContactMessageSchema.methods.addReply = function (message, repliedBy) {
    this.reply = {
        message,
        repliedBy,
        repliedAt: new Date()
    };
    this.status = 'resolved';
    return this.save();
};
const ContactMessage = mongoose_1.default.model('ContactMessage', ContactMessageSchema);
exports.default = ContactMessage;
