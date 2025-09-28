import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanyInfo extends Document {
    section: 'general' | 'history' | 'competitiveness' | 'system' | 'partners' | 'social_activities';
    title: string;
    content: string;
    images?: string[];
    data?: {
        // For history section
        milestones?: Array<{
            year: string;
            event: string;
            description?: string;
        }>;
        // For competitiveness section
        strengths?: Array<{
            title: string;
            description: string;
            icon: string;
            color: string;
        }>;
        // For system section
        businessAreas?: Array<{
            name: string;
            description: string;
            items: string[];
            color: string;
        }>;
        network?: Array<{
            city: string;
            projects: number;
            staff: number;
        }>;
        // For partners section
        partners?: Array<{
            name: string;
            type: string;
            logo?: string;
        }>;
        // For social activities section
        activities?: Array<{
            title: string;
            description: string;
            image?: string;
        }>;
        achievements?: Array<{
            number: string;
            label: string;
        }>;
    };
    isActive: boolean;
    sortOrder: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CompanyInfoSchema = new Schema<ICompanyInfo>({
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
CompanyInfoSchema.index({ section: 1 });
CompanyInfoSchema.index({ isActive: 1 });
CompanyInfoSchema.index({ sortOrder: 1 });
CompanyInfoSchema.index({ createdAt: -1 });

// Compound indexes
CompanyInfoSchema.index({ section: 1, isActive: 1 });
CompanyInfoSchema.index({ section: 1, sortOrder: 1 });

// Static method to find by section
CompanyInfoSchema.statics.findBySection = function (section: string) {
    return this.findOne({ section, isActive: true });
};

// Static method to find active sections
CompanyInfoSchema.statics.findActiveSections = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1 });
};

// Static methods interface
interface ICompanyInfoModel extends mongoose.Model<ICompanyInfo> {
    findBySection(section: string): Promise<ICompanyInfo | null>;
    findActiveSections(): Promise<ICompanyInfo[]>;
}

// Export the model
const CompanyInfo = mongoose.model<ICompanyInfo, ICompanyInfoModel>('CompanyInfo', CompanyInfoSchema);

export default CompanyInfo;
