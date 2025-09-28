import mongoose, { Document, Schema } from 'mongoose';

export interface IJobPosition extends Document {
    title: string;
    slug: string;
    department: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    salary: string;
    experience: string;
    deadline: Date;
    description: string;
    requirements: string[];
    benefits: string[];
    responsibilities: string[];
    skills: string[];
    isHot: boolean;
    isUrgent: boolean;
    isActive: boolean;
    status: 'draft' | 'published' | 'closed' | 'cancelled';
    priority: number;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const JobPositionSchema = new Schema<IJobPosition>({
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
            validator: function (value: Date) {
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
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

// Compound indexes
JobPositionSchema.index({ department: 1, status: 1, isActive: 1 });
JobPositionSchema.index({ type: 1, status: 1, isActive: 1 });
JobPositionSchema.index({ isHot: 1, isActive: 1 });
JobPositionSchema.index({ isUrgent: 1, isActive: 1 });
JobPositionSchema.index({ status: 1, deadline: 1 });

// Virtual for type display
JobPositionSchema.virtual('typeDisplay').get(function () {
    const typeMap = {
        'full-time': 'Toàn thời gian',
        'part-time': 'Bán thời gian',
        'contract': 'Hợp đồng',
        'internship': 'Thực tập'
    };
    return typeMap[this.type] || this.type;
});

// Virtual for department display
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
    return (deptMap as any)[this.department] || this.department;
});

// Virtual for status display
JobPositionSchema.virtual('statusDisplay').get(function () {
    const statusMap = {
        'draft': 'Bản nháp',
        'published': 'Đã xuất bản',
        'closed': 'Đã đóng',
        'cancelled': 'Đã hủy'
    };
    return statusMap[this.status] || this.status;
});

// Pre-save middleware to generate slug if not provided
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

// Static method to find active positions
JobPositionSchema.statics.findActivePositions = function () {
    return this.find({
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};

// Static method to find by department
JobPositionSchema.statics.findByDepartment = function (department: string) {
    return this.find({
        department,
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};

// Static method to find hot positions
JobPositionSchema.statics.findHotPositions = function () {
    return this.find({
        isHot: true,
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};

// Static method to find urgent positions
JobPositionSchema.statics.findUrgentPositions = function () {
    return this.find({
        isUrgent: true,
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};

// Static method to search positions
JobPositionSchema.statics.searchPositions = function (query: string) {
    return this.find({
        $text: { $search: query },
        isActive: true,
        status: 'published',
        deadline: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });
};

// Export the model
const JobPosition = mongoose.model<IJobPosition>('JobPosition', JobPositionSchema);

export default JobPosition;
