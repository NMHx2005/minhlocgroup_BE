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
const EmailTemplateSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Tên template là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên template phải có ít nhất 2 ký tự'],
        maxlength: [200, 'Tên template không được quá 200 ký tự']
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
    type: {
        type: String,
        required: [true, 'Loại template là bắt buộc'],
        enum: {
            values: ['welcome', 'newsletter', 'notification', 'transactional', 'marketing', 'custom'],
            message: 'Loại template phải là welcome, newsletter, notification, transactional, marketing hoặc custom'
        }
    },
    variables: [{
            type: String,
            trim: true,
            match: [
                /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                'Tên biến chỉ được chứa chữ cái, số và dấu gạch dưới, bắt đầu bằng chữ cái hoặc gạch dưới'
            ]
        }],
    isActive: {
        type: Boolean,
        default: true
    },
    isSystem: {
        type: Boolean,
        default: false
    },
    previewText: {
        type: String,
        trim: true,
        maxlength: [200, 'Preview text không được quá 200 ký tự']
    },
    fromName: {
        type: String,
        trim: true,
        maxlength: [100, 'Tên người gửi không được quá 100 ký tự']
    },
    fromEmail: {
        type: String,
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
    },
    ccEmails: [{
            type: String,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Email CC không hợp lệ'
            ]
        }],
    bccEmails: [{
            type: String,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Email BCC không hợp lệ'
            ]
        }],
    attachments: [{
            type: String,
            trim: true,
            match: [
                /^https?:\/\/.+\.(pdf|doc|docx|txt|jpg|jpeg|png|gif|webp)$/i,
                'URL file đính kèm không hợp lệ'
            ]
        }],
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
        enablePlainText: {
            type: Boolean,
            default: true
        },
        enableHtml: {
            type: Boolean,
            default: true
        }
    },
    usageCount: {
        type: Number,
        default: 0,
        min: [0, 'Số lần sử dụng không được âm']
    },
    lastUsedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo là bắt buộc']
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người cập nhật là bắt buộc']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
EmailTemplateSchema.index({ name: 1 });
EmailTemplateSchema.index({ type: 1 });
EmailTemplateSchema.index({ isActive: 1 });
EmailTemplateSchema.index({ isSystem: 1 });
EmailTemplateSchema.index({ createdBy: 1 });
EmailTemplateSchema.index({ usageCount: -1 });
EmailTemplateSchema.index({ lastUsedAt: -1 });
EmailTemplateSchema.index({ type: 1, isActive: 1 });
EmailTemplateSchema.index({ isSystem: 1, isActive: 1 });
EmailTemplateSchema.index({ createdBy: 1, isActive: 1 });
EmailTemplateSchema.virtual('creator', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});
EmailTemplateSchema.virtual('updater', {
    ref: 'User',
    localField: 'updatedBy',
    foreignField: '_id',
    justOne: true
});
EmailTemplateSchema.virtual('typeDisplay').get(function () {
    const typeMap = {
        'welcome': 'Chào mừng',
        'newsletter': 'Bản tin',
        'notification': 'Thông báo',
        'transactional': 'Giao dịch',
        'marketing': 'Marketing',
        'custom': 'Tùy chỉnh'
    };
    return typeMap[this.type] || this.type;
});
EmailTemplateSchema.virtual('variablesCount').get(function () {
    return this.variables.length;
});
EmailTemplateSchema.virtual('contentPreview').get(function () {
    return this.content.substring(0, 200) + (this.content.length > 200 ? '...' : '');
});
EmailTemplateSchema.pre('save', function (next) {
    if (this.isModified('content') || this.isModified('subject')) {
        const text = `${this.subject} ${this.content}`;
        const variableRegex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
        const matches = text.match(variableRegex);
        if (matches) {
            this.variables = [...new Set(matches.map(match => match.slice(2, -2)))];
        }
        else {
            this.variables = [];
        }
    }
    next();
});
EmailTemplateSchema.pre('save', function (next) {
    if (this.isModified('content') && !this.previewText) {
        const textContent = this.content.replace(/<[^>]*>/g, '');
        this.previewText = textContent.substring(0, 200);
    }
    next();
});
EmailTemplateSchema.statics.findActiveTemplates = function () {
    return this.find({ isActive: true }).sort({ name: 1 });
};
EmailTemplateSchema.statics.findByType = function (type) {
    return this.find({ type, isActive: true }).sort({ name: 1 });
};
EmailTemplateSchema.statics.findSystemTemplates = function () {
    return this.find({ isSystem: true, isActive: true }).sort({ name: 1 });
};
EmailTemplateSchema.statics.findCustomTemplates = function () {
    return this.find({ isSystem: false, isActive: true }).sort({ name: 1 });
};
EmailTemplateSchema.statics.findByCreator = function (creatorId) {
    return this.find({ createdBy: creatorId }).sort({ createdAt: -1 });
};
EmailTemplateSchema.statics.findMostUsed = function (limit = 10) {
    return this.find({ isActive: true })
        .sort({ usageCount: -1, lastUsedAt: -1 })
        .limit(limit);
};
EmailTemplateSchema.statics.findRecentlyUsed = function (limit = 10) {
    return this.find({ isActive: true, lastUsedAt: { $exists: true } })
        .sort({ lastUsedAt: -1 })
        .limit(limit);
};
EmailTemplateSchema.statics.searchTemplates = function (query) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { subject: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } }
        ],
        isActive: true
    }).sort({ name: 1 });
};
EmailTemplateSchema.statics.getTemplateStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                active: { $sum: { $cond: ['$isActive', 1, 0] } },
                system: { $sum: { $cond: ['$isSystem', 1, 0] } },
                custom: { $sum: { $cond: [{ $eq: ['$isSystem', false] }, 1, 0] } },
                totalUsage: { $sum: '$usageCount' },
                avgUsage: { $avg: '$usageCount' }
            }
        }
    ]);
    const result = stats[0] || {
        total: 0,
        active: 0,
        system: 0,
        custom: 0,
        totalUsage: 0,
        avgUsage: 0
    };
    return result;
};
EmailTemplateSchema.methods.recordUsage = function () {
    this.usageCount += 1;
    this.lastUsedAt = new Date();
    return this.save();
};
EmailTemplateSchema.methods.activate = function () {
    this.isActive = true;
    return this.save();
};
EmailTemplateSchema.methods.deactivate = function () {
    this.isActive = false;
    return this.save();
};
EmailTemplateSchema.methods.render = function (variables) {
    let renderedSubject = this.subject;
    let renderedContent = this.content;
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        renderedSubject = renderedSubject.replace(regex, variables[key] || '');
        renderedContent = renderedContent.replace(regex, variables[key] || '');
    });
    return {
        subject: renderedSubject,
        content: renderedContent,
        previewText: this.previewText
    };
};
EmailTemplateSchema.methods.validateVariables = function (variables) {
    const missingVariables = this.variables.filter((variable) => !(variable in variables) || variables[variable] === undefined || variables[variable] === null);
    return {
        isValid: missingVariables.length === 0,
        missingVariables
    };
};
EmailTemplateSchema.methods.clone = function (newName, createdBy) {
    const clonedTemplate = new this.constructor({
        name: newName,
        subject: this.subject,
        content: this.content,
        type: this.type,
        variables: [...this.variables],
        previewText: this.previewText,
        fromName: this.fromName,
        fromEmail: this.fromEmail,
        replyToEmail: this.replyToEmail,
        ccEmails: [...(this.ccEmails || [])],
        bccEmails: [...(this.bccEmails || [])],
        attachments: [...(this.attachments || [])],
        settings: { ...this.settings },
        createdBy,
        updatedBy: createdBy
    });
    return clonedTemplate.save();
};
const EmailTemplate = mongoose_1.default.model('EmailTemplate', EmailTemplateSchema);
exports.default = EmailTemplate;
