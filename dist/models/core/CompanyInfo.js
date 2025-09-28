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
const CompanyInfoSchema = new mongoose_1.Schema({
    section: {
        type: String,
        required: [true, 'Section là bắt buộc'],
        enum: {
            values: ['general', 'history', 'competitiveness', 'system', 'partners', 'social_activities'],
            message: 'Section phải là general, history, competitiveness, system, partners hoặc social_activities'
        }
    },
    title: {
        type: String,
        required: [true, 'Tiêu đề là bắt buộc'],
        trim: true,
        maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
    },
    content: {
        type: String,
        required: [true, 'Nội dung là bắt buộc'],
        minlength: [50, 'Nội dung phải có ít nhất 50 ký tự']
    },
    images: [{
            type: String,
            trim: true,
            match: [
                /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                'URL hình ảnh không hợp lệ'
            ]
        }],
    data: {
        companyName: {
            type: String,
            trim: true,
            maxlength: [200, 'Tên công ty không được quá 200 ký tự']
        },
        foundedYear: {
            type: Number,
            min: [1900, 'Năm thành lập phải từ 1900 trở lên'],
            max: [new Date().getFullYear(), 'Năm thành lập không được vượt quá năm hiện tại']
        },
        headquarters: {
            type: String,
            trim: true,
            maxlength: [200, 'Trụ sở chính không được quá 200 ký tự']
        },
        contactInfo: {
            email: {
                type: String,
                trim: true,
                match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
            },
            phone: {
                type: String,
                trim: true,
                maxlength: [20, 'Số điện thoại không được quá 20 ký tự']
            },
            address: {
                type: String,
                trim: true,
                maxlength: [500, 'Địa chỉ không được quá 500 ký tự']
            },
            website: {
                type: String,
                trim: true,
                match: [/^https?:\/\/.+/, 'Website phải bắt đầu bằng http:// hoặc https://']
            }
        },
        socialMedia: {
            facebook: {
                type: String,
                trim: true,
                match: [/^https?:\/\/.+/, 'Facebook URL phải bắt đầu bằng http:// hoặc https://']
            },
            linkedin: {
                type: String,
                trim: true,
                match: [/^https?:\/\/.+/, 'LinkedIn URL phải bắt đầu bằng http:// hoặc https://']
            },
            youtube: {
                type: String,
                trim: true,
                match: [/^https?:\/\/.+/, 'YouTube URL phải bắt đầu bằng http:// hoặc https://']
            }
        },
        mission: {
            type: String,
            trim: true,
            maxlength: [1000, 'Sứ mệnh không được quá 1000 ký tự']
        },
        vision: {
            type: String,
            trim: true,
            maxlength: [1000, 'Tầm nhìn không được quá 1000 ký tự']
        },
        values: [{
                type: String,
                trim: true,
                maxlength: [200, 'Mỗi giá trị không được quá 200 ký tự']
            }],
        milestones: [{
                year: {
                    type: String,
                    required: true,
                    trim: true
                },
                event: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [200, 'Sự kiện không được quá 200 ký tự']
                },
                description: {
                    type: String,
                    trim: true,
                    maxlength: [500, 'Mô tả không được quá 500 ký tự']
                }
            }],
        strengths: [{
                title: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [100, 'Tiêu đề không được quá 100 ký tự']
                },
                description: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [500, 'Mô tả không được quá 500 ký tự']
                },
                icon: {
                    type: String,
                    required: true,
                    trim: true
                },
                color: {
                    type: String,
                    required: true,
                    trim: true,
                    match: [/^#[0-9A-Fa-f]{6}$/, 'Màu sắc phải là mã hex hợp lệ']
                }
            }],
        businessAreas: [{
                name: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [100, 'Tên lĩnh vực không được quá 100 ký tự']
                },
                description: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [500, 'Mô tả không được quá 500 ký tự']
                },
                items: [{
                        type: String,
                        trim: true,
                        maxlength: [100, 'Mỗi item không được quá 100 ký tự']
                    }],
                color: {
                    type: String,
                    required: true,
                    trim: true,
                    match: [/^#[0-9A-Fa-f]{6}$/, 'Màu sắc phải là mã hex hợp lệ']
                }
            }],
        network: [{
                city: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [50, 'Tên thành phố không được quá 50 ký tự']
                },
                projects: {
                    type: Number,
                    required: true,
                    min: [0, 'Số dự án không được âm']
                },
                staff: {
                    type: Number,
                    required: true,
                    min: [0, 'Số nhân viên không được âm']
                }
            }],
        partners: [{
                name: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [200, 'Tên đối tác không được quá 200 ký tự']
                },
                type: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [100, 'Loại đối tác không được quá 100 ký tự']
                },
                logo: {
                    type: String,
                    trim: true,
                    match: [
                        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                        'URL logo không hợp lệ'
                    ]
                }
            }],
        activities: [{
                title: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [200, 'Tiêu đề hoạt động không được quá 200 ký tự']
                },
                description: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [1000, 'Mô tả hoạt động không được quá 1000 ký tự']
                },
                image: {
                    type: String,
                    trim: true,
                    match: [
                        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                        'URL hình ảnh không hợp lệ'
                    ]
                }
            }],
        achievements: [{
                number: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [20, 'Số liệu không được quá 20 ký tự']
                },
                label: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [100, 'Nhãn không được quá 100 ký tự']
                }
            }]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
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
CompanyInfoSchema.index({ section: 1 });
CompanyInfoSchema.index({ isActive: 1 });
CompanyInfoSchema.index({ sortOrder: 1 });
CompanyInfoSchema.index({ createdAt: -1 });
CompanyInfoSchema.index({ section: 1, isActive: 1 });
CompanyInfoSchema.index({ section: 1, sortOrder: 1 });
CompanyInfoSchema.statics.findBySection = function (section) {
    return this.findOne({ section, isActive: true });
};
CompanyInfoSchema.statics.findActiveSections = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1 });
};
const CompanyInfo = mongoose_1.default.model('CompanyInfo', CompanyInfoSchema);
exports.default = CompanyInfo;
//# sourceMappingURL=CompanyInfo.js.map