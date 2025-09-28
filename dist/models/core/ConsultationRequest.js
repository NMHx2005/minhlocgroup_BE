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
const ConsultationRequestSchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Tên khách hàng là bắt buộc'],
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
        required: [true, 'Số điện thoại là bắt buộc'],
        trim: true,
        match: [
            /^[\+]?[1-9][\d]{0,15}$/,
            'Số điện thoại không hợp lệ'
        ]
    },
    serviceType: {
        type: String,
        required: [true, 'Loại dịch vụ là bắt buộc'],
        enum: {
            values: ['real_estate', 'ginseng', 'general'],
            message: 'Loại dịch vụ phải là real_estate, ginseng hoặc general'
        }
    },
    interestIn: {
        type: {
            type: String,
            enum: {
                values: ['project', 'product'],
                message: 'Loại quan tâm phải là project hoặc product'
            }
        },
        id: {
            type: mongoose_1.Schema.Types.ObjectId,
            refPath: 'interestIn.type'
        },
        name: {
            type: String,
            trim: true,
            maxlength: [200, 'Tên không được quá 200 ký tự']
        }
    },
    budgetRange: {
        type: String,
        trim: true,
        maxlength: [100, 'Khoảng ngân sách không được quá 100 ký tự']
    },
    preferredContactTime: {
        type: String,
        trim: true,
        maxlength: [100, 'Thời gian liên hệ ưa thích không được quá 100 ký tự']
    },
    message: {
        type: String,
        required: [true, 'Tin nhắn là bắt buộc'],
        trim: true,
        minlength: [10, 'Tin nhắn phải có ít nhất 10 ký tự'],
        maxlength: [2000, 'Tin nhắn không được quá 2000 ký tự']
    },
    status: {
        type: String,
        required: [true, 'Trạng thái là bắt buộc'],
        enum: {
            values: ['new', 'contacted', 'qualified', 'converted', 'lost', 'closed'],
            message: 'Trạng thái phải là new, contacted, qualified, converted, lost hoặc closed'
        },
        default: 'new'
    },
    priority: {
        type: String,
        required: [true, 'Mức độ ưu tiên là bắt buộc'],
        enum: {
            values: ['low', 'normal', 'high', 'urgent'],
            message: 'Mức độ ưu tiên phải là low, normal, high hoặc urgent'
        },
        default: 'normal'
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
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
    },
    source: {
        type: String,
        required: [true, 'Nguồn là bắt buộc'],
        enum: {
            values: ['website', 'facebook', 'phone', 'referral', 'ads', 'other'],
            message: 'Nguồn phải là website, facebook, phone, referral, ads hoặc other'
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
    ipAddress: {
        type: String,
        trim: true,
        match: [
            /^(?:(?:25[0-5]|2[0-4][\d]|[01]?[\d][\d]?)\.){3}(?:25[0-5]|2[0-4][\d]|[01]?[\d][\d]?)$/,
            'Địa chỉ IP không hợp lệ'
        ]
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
    estimatedValue: {
        type: Number,
        min: [0, 'Giá trị ước tính không được âm']
    },
    conversionProbability: {
        type: Number,
        min: [0, 'Xác suất chuyển đổi không được âm'],
        max: [100, 'Xác suất chuyển đổi không được quá 100%']
    },
    lastContactAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
ConsultationRequestSchema.index({ email: 1 });
ConsultationRequestSchema.index({ phone: 1 });
ConsultationRequestSchema.index({ status: 1 });
ConsultationRequestSchema.index({ priority: 1 });
ConsultationRequestSchema.index({ serviceType: 1 });
ConsultationRequestSchema.index({ assignedTo: 1 });
ConsultationRequestSchema.index({ source: 1 });
ConsultationRequestSchema.index({ followUpDate: 1 });
ConsultationRequestSchema.index({ createdAt: -1 });
ConsultationRequestSchema.index({ tags: 1 });
ConsultationRequestSchema.index({ status: 1, priority: 1 });
ConsultationRequestSchema.index({ assignedTo: 1, status: 1 });
ConsultationRequestSchema.index({ serviceType: 1, status: 1 });
ConsultationRequestSchema.index({ status: 1, createdAt: -1 });
ConsultationRequestSchema.index({ priority: 1, createdAt: -1 });
ConsultationRequestSchema.virtual('customer', {
    ref: 'User',
    localField: 'customerId',
    foreignField: '_id',
    justOne: true
});
ConsultationRequestSchema.virtual('assignedUser', {
    ref: 'User',
    localField: 'assignedTo',
    foreignField: '_id',
    justOne: true
});
ConsultationRequestSchema.virtual('timeSinceCreation').get(function () {
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
ConsultationRequestSchema.virtual('statusDisplay').get(function () {
    const statusMap = {
        'new': 'Mới',
        'contacted': 'Đã liên hệ',
        'qualified': 'Đã đủ điều kiện',
        'converted': 'Đã chuyển đổi',
        'lost': 'Đã mất',
        'closed': 'Đã đóng'
    };
    return statusMap[this.status] || this.status;
});
ConsultationRequestSchema.virtual('priorityDisplay').get(function () {
    const priorityMap = {
        'low': 'Thấp',
        'normal': 'Bình thường',
        'high': 'Cao',
        'urgent': 'Khẩn cấp'
    };
    return priorityMap[this.priority] || this.priority;
});
ConsultationRequestSchema.virtual('serviceTypeDisplay').get(function () {
    const serviceMap = {
        'real_estate': 'Bất động sản',
        'ginseng': 'Nhân sâm',
        'general': 'Tổng quát'
    };
    return serviceMap[this.serviceType] || this.serviceType;
});
ConsultationRequestSchema.pre('save', function (next) {
    if (this.isNew && !this.followUpDate) {
        const now = new Date();
        switch (this.priority) {
            case 'urgent':
                this.followUpDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                break;
            case 'high':
                this.followUpDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                break;
            case 'normal':
                this.followUpDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
                break;
            case 'low':
                this.followUpDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
        }
    }
    next();
});
ConsultationRequestSchema.statics.findNewRequests = function () {
    return this.find({ status: 'new' }).sort({ priority: -1, createdAt: -1 });
};
ConsultationRequestSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort({ createdAt: -1 });
};
ConsultationRequestSchema.statics.findByPriority = function (priority) {
    return this.find({ priority }).sort({ createdAt: -1 });
};
ConsultationRequestSchema.statics.findByServiceType = function (serviceType) {
    return this.find({ serviceType }).sort({ createdAt: -1 });
};
ConsultationRequestSchema.statics.findByAssignedUser = function (userId) {
    return this.find({ assignedTo: userId }).sort({ createdAt: -1 });
};
ConsultationRequestSchema.statics.findOverdueRequests = function () {
    return this.find({
        followUpDate: { $lt: new Date() },
        status: { $in: ['new', 'contacted', 'qualified'] }
    }).sort({ followUpDate: 1 });
};
ConsultationRequestSchema.statics.findHighValueRequests = function () {
    return this.find({
        estimatedValue: { $gte: 1000000 },
        status: { $in: ['new', 'contacted', 'qualified'] }
    }).sort({ estimatedValue: -1 });
};
ConsultationRequestSchema.statics.getRequestStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
                contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
                qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
                converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
                lost: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
                urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
                high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
                normal: { $sum: { $cond: [{ $eq: ['$priority', 'normal'] }, 1, 0] } },
                low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
                totalValue: { $sum: { $ifNull: ['$estimatedValue', 0] } },
                avgValue: { $avg: { $ifNull: ['$estimatedValue', 0] } }
            }
        }
    ]);
    const result = stats[0] || {
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        lost: 0,
        closed: 0,
        urgent: 0,
        high: 0,
        normal: 0,
        low: 0,
        totalValue: 0,
        avgValue: 0
    };
    result.conversionRate = result.total > 0
        ? ((result.converted / result.total) * 100).toFixed(2)
        : 0;
    return result;
};
ConsultationRequestSchema.methods.assignTo = function (userId) {
    this.assignedTo = userId;
    this.status = 'contacted';
    this.lastContactAt = new Date();
    return this.save();
};
ConsultationRequestSchema.methods.updateStatus = function (status, notes) {
    this.status = status;
    if (notes) {
        this.notes = (this.notes || '') + `\n[${new Date().toISOString()}] ${notes}`;
    }
    if (status === 'contacted') {
        this.lastContactAt = new Date();
    }
    return this.save();
};
ConsultationRequestSchema.methods.setFollowUp = function (followUpDate) {
    this.followUpDate = followUpDate;
    return this.save();
};
ConsultationRequestSchema.methods.addNote = function (note) {
    this.notes = (this.notes || '') + `\n[${new Date().toISOString()}] ${note}`;
    return this.save();
};
const ConsultationRequest = mongoose_1.default.model('ConsultationRequest', ConsultationRequestSchema);
exports.default = ConsultationRequest;
