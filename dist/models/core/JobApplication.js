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
const JobApplicationSchema = new mongoose_1.Schema({
    jobPositionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'JobPosition',
        required: [true, 'Vị trí công việc là bắt buộc']
    },
    applicantName: {
        type: String,
        required: [true, 'Tên ứng viên là bắt buộc'],
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
            /^[0-9+\-\s()]+$/,
            'Số điện thoại không hợp lệ'
        ]
    },
    cvUrl: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+\.(pdf|doc|docx)$/i,
            'URL CV phải là file PDF hoặc DOC'
        ]
    },
    coverLetter: {
        type: String,
        trim: true,
        maxlength: [2000, 'Thư xin việc không được quá 2000 ký tự']
    },
    experience: {
        type: String,
        required: [true, 'Kinh nghiệm là bắt buộc'],
        trim: true,
        maxlength: [500, 'Kinh nghiệm không được quá 500 ký tự']
    },
    education: {
        type: String,
        required: [true, 'Học vấn là bắt buộc'],
        trim: true,
        maxlength: [500, 'Học vấn không được quá 500 ký tự']
    },
    skills: [{
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'Mỗi kỹ năng không được quá 100 ký tự']
        }],
    expectedSalary: {
        type: String,
        trim: true,
        maxlength: [100, 'Mức lương mong muốn không được quá 100 ký tự']
    },
    availableDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return !value || value >= new Date();
            },
            message: 'Ngày có thể bắt đầu làm việc phải sau ngày hiện tại'
        }
    },
    status: {
        type: String,
        required: [true, 'Trạng thái là bắt buộc'],
        enum: {
            values: ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected', 'withdrawn'],
            message: 'Trạng thái phải là pending, reviewing, interviewed, accepted, rejected hoặc withdrawn'
        },
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Ghi chú không được quá 1000 ký tự']
    },
    interviewDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return !value || value >= new Date();
            },
            message: 'Ngày phỏng vấn phải sau ngày hiện tại'
        }
    },
    interviewNotes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Ghi chú phỏng vấn không được quá 1000 ký tự']
    },
    rating: {
        type: Number,
        min: [1, 'Đánh giá phải từ 1 đến 5'],
        max: [5, 'Đánh giá phải từ 1 đến 5']
    },
    source: {
        type: String,
        required: [true, 'Nguồn ứng tuyển là bắt buộc'],
        trim: true,
        maxlength: [50, 'Nguồn ứng tuyển không được quá 50 ký tự']
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
JobApplicationSchema.index({ jobPositionId: 1 });
JobApplicationSchema.index({ email: 1 });
JobApplicationSchema.index({ phone: 1 });
JobApplicationSchema.index({ status: 1 });
JobApplicationSchema.index({ createdAt: -1 });
JobApplicationSchema.index({ source: 1 });
JobApplicationSchema.index({ jobPositionId: 1, status: 1 });
JobApplicationSchema.index({ status: 1, createdAt: -1 });
JobApplicationSchema.index({ email: 1, jobPositionId: 1 });
JobApplicationSchema.virtual('statusDisplay').get(function () {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'reviewing': 'Đang xem xét',
        'interviewed': 'Đã phỏng vấn',
        'accepted': 'Đã chấp nhận',
        'rejected': 'Đã từ chối',
        'withdrawn': 'Đã rút hồ sơ'
    };
    return statusMap[this.status] || this.status;
});
JobApplicationSchema.statics.findByJobPosition = function (jobPositionId) {
    return this.find({ jobPositionId }).sort({ createdAt: -1 });
};
JobApplicationSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort({ createdAt: -1 });
};
JobApplicationSchema.statics.findByEmail = function (email) {
    return this.find({ email }).sort({ createdAt: -1 });
};
JobApplicationSchema.statics.getStatistics = function () {
    return this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
};
const JobApplication = mongoose_1.default.model('JobApplication', JobApplicationSchema);
exports.default = JobApplication;
