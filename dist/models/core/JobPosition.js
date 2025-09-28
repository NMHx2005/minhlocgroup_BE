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
const JobPositionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề công việc là bắt buộc'],
        trim: true,
        minlength: [10, 'Tiêu đề phải có ít nhất 10 ký tự'],
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
    department: {
        type: String,
        required: [true, 'Phòng ban là bắt buộc'],
        trim: true,
        enum: {
            values: ['sales', 'marketing', 'construction', 'finance', 'hr', 'it', 'admin', 'operations'],
            message: 'Phòng ban không hợp lệ'
        }
    },
    location: {
        type: String,
        required: [true, 'Địa điểm làm việc là bắt buộc'],
        trim: true,
        maxlength: [100, 'Địa điểm không được quá 100 ký tự']
    },
    type: {
        type: String,
        required: [true, 'Loại công việc là bắt buộc'],
        enum: {
            values: ['full-time', 'part-time', 'contract', 'internship'],
            message: 'Loại công việc phải là full-time, part-time, contract hoặc internship'
        }
    },
    salary: {
        type: String,
        required: [true, 'Mức lương là bắt buộc'],
        trim: true,
        maxlength: [100, 'Mức lương không được quá 100 ký tự']
    },
    experience: {
        type: String,
        required: [true, 'Kinh nghiệm là bắt buộc'],
        trim: true,
        maxlength: [50, 'Kinh nghiệm không được quá 50 ký tự']
    },
    deadline: {
        type: Date,
        required: [true, 'Hạn nộp hồ sơ là bắt buộc'],
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Hạn nộp hồ sơ phải sau ngày hiện tại'
        }
    },
    description: {
        type: String,
        required: [true, 'Mô tả công việc là bắt buộc'],
        minlength: [100, 'Mô tả phải có ít nhất 100 ký tự'],
        maxlength: [2000, 'Mô tả không được quá 2000 ký tự']
    },
    requirements: [{
            type: String,
            required: true,
            trim: true,
            maxlength: [200, 'Mỗi yêu cầu không được quá 200 ký tự']
        }],
    benefits: [{
            type: String,
            required: true,
            trim: true,
            maxlength: [200, 'Mỗi phúc lợi không được quá 200 ký tự']
        }],
    responsibilities: [{
            type: String,
            required: true,
            trim: true,
            maxlength: [200, 'Mỗi trách nhiệm không được quá 200 ký tự']
        }],
    skills: [{
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'Mỗi kỹ năng không được quá 100 ký tự']
        }],
    isHot: {
        type: Boolean,
        default: false
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        required: [true, 'Trạng thái là bắt buộc'],
        enum: {
            values: ['draft', 'published', 'closed', 'cancelled'],
            message: 'Trạng thái phải là draft, published, closed hoặc cancelled'
        },
        default: 'draft'
    },
    priority: {
        type: Number,
        default: 0,
        min: [0, 'Độ ưu tiên không được âm'],
        max: [10, 'Độ ưu tiên không được quá 10']
    },
    tags: [{
            type: String,
            trim: true,
            maxlength: [50, 'Mỗi tag không được quá 50 ký tự']
        }],
    seoTitle: {
        type: String,
        trim: true,
        maxlength: [200, 'SEO title không được quá 200 ký tự']
    },
    seoDescription: {
        type: String,
        trim: true,
        maxlength: [300, 'SEO description không được quá 300 ký tự']
    },
    seoKeywords: [{
            type: String,
            trim: true,
            maxlength: [50, 'Mỗi keyword không được quá 50 ký tự']
        }],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
JobPositionSchema.index({ title: 'text', description: 'text' });
JobPositionSchema.index({ department: 1 });
JobPositionSchema.index({ location: 1 });
JobPositionSchema.index({ type: 1 });
JobPositionSchema.index({ status: 1 });
JobPositionSchema.index({ isActive: 1 });
JobPositionSchema.index({ isHot: 1 });
JobPositionSchema.index({ isUrgent: 1 });
JobPositionSchema.index({ deadline: 1 });
JobPositionSchema.index({ priority: -1 });
JobPositionSchema.index({ createdAt: -1 });
JobPositionSchema.index({ tags: 1 });
JobPositionSchema.index({ department: 1, status: 1, isActive: 1 });
JobPositionSchema.index({ type: 1, status: 1, isActive: 1 });
JobPositionSchema.index({ isHot: 1, isActive: 1 });
JobPositionSchema.index({ isUrgent: 1, isActive: 1 });
JobPositionSchema.index({ status: 1, deadline: 1 });
JobPositionSchema.virtual('typeDisplay').get(function () {
    const typeMap = {
        'full-time': 'Toàn thời gian',
        'part-time': 'Bán thời gian',
        'contract': 'Hợp đồng',
        'internship': 'Thực tập'
    };
    return typeMap[this.type] || this.type;
});
JobPositionSchema.virtual('departmentDisplay').get(function () {
    const deptMap = {
        'sales': 'Kinh doanh',
        'marketing': 'Marketing',
        'construction': 'Xây dựng',
        'finance': 'Tài chính',
        'hr': 'Nhân sự',
        'it': 'Công nghệ thông tin',
        'admin': 'Hành chính',
        'operations': 'Vận hành'
    };
    return deptMap[this.department] || this.department;
});
JobPositionSchema.virtual('statusDisplay').get(function () {
    const statusMap = {
        'draft': 'Bản nháp',
        'published': 'Đã xuất bản',
        'closed': 'Đã đóng',
        'cancelled': 'Đã hủy'
    };
    return statusMap[this.status] || this.status;
});
JobPositionSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        const slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        this.slug = slug;
    }
    next();
});
JobPositionSchema.statics.findActivePositions = function () {
    return this.find({
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};
JobPositionSchema.statics.findByDepartment = function (department) {
    return this.find({
        department,
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};
JobPositionSchema.statics.findHotPositions = function () {
    return this.find({
        isHot: true,
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};
JobPositionSchema.statics.findUrgentPositions = function () {
    return this.find({
        isUrgent: true,
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};
JobPositionSchema.statics.searchPositions = function (query) {
    return this.find({
        $text: { $search: query },
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};
const JobPosition = mongoose_1.default.model('JobPosition', JobPositionSchema);
exports.default = JobPosition;
