import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemSetting extends Document {
    key: string;
    value: any;
    type: 'text' | 'number' | 'boolean' | 'json' | 'file' | 'url' | 'email';
    group: 'general' | 'api' | 'email' | 'social' | 'seo' | 'security' | 'payment' | 'notification';
    description?: string;
    isPublic: boolean;
    isRequired: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        options?: string[];
    };
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SystemSettingSchema = new Schema<ISystemSetting>({
    key: {
        type: String,
        required: [true, 'Key là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[a-z0-9_]+$/,
            'Key chỉ được chứa chữ cái thường, số và dấu gạch dưới'
        ]
    },
    value: {
        type: Schema.Types.Mixed,
        required: [true, 'Value là bắt buộc']
    },
    type: {
        type: String,
        required: [true, 'Kiểu dữ liệu là bắt buộc'],
        enum: {
            values: ['text', 'number', 'boolean', 'json', 'file', 'url', 'email'],
            message: 'Kiểu dữ liệu phải là text, number, boolean, json, file, url hoặc email'
        }
    },
    group: {
        type: String,
        required: [true, 'Nhóm là bắt buộc'],
        enum: {
            values: ['general', 'api', 'email', 'social', 'seo', 'security', 'payment', 'notification'],
            message: 'Nhóm phải là general, api, email, social, seo, security, payment hoặc notification'
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    isRequired: {
        type: Boolean,
        default: false
    },
    validation: {
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        pattern: {
            type: String,
            trim: true
        },
        options: [{
            type: String,
            trim: true
        }]
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người cập nhật là bắt buộc']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// Note: key index is automatically created by unique: true
SystemSettingSchema.index({ group: 1 });
SystemSettingSchema.index({ isPublic: 1 });
SystemSettingSchema.index({ isRequired: 1 });
SystemSettingSchema.index({ updatedBy: 1 });

// Compound indexes
SystemSettingSchema.index({ group: 1, isPublic: 1 });
SystemSettingSchema.index({ group: 1, isRequired: 1 });

// Virtual for updated by user
SystemSettingSchema.virtual('updatedByUser', {
    ref: 'User',
    localField: 'updatedBy',
    foreignField: '_id',
    justOne: true
});

// Pre-save middleware to validate value based on type
SystemSettingSchema.pre('save', function (next) {
    if (this.isModified('value')) {
        switch (this.type) {
            case 'text':
                if (typeof this.value !== 'string') {
                    this.value = String(this.value);
                }
                if (this.validation?.max && this.value.length > this.validation.max) {
                    return next(new Error(`Value quá dài. Tối đa ${this.validation.max} ký tự`));
                }
                if (this.validation?.min && this.value.length < this.validation.min) {
                    return next(new Error(`Value quá ngắn. Tối thiểu ${this.validation.min} ký tự`));
                }
                break;

            case 'number':
                const numValue = Number(this.value);
                if (isNaN(numValue)) {
                    return next(new Error('Value phải là số'));
                }
                this.value = numValue;
                if (this.validation?.max && numValue > this.validation.max) {
                    return next(new Error(`Value quá lớn. Tối đa ${this.validation.max}`));
                }
                if (this.validation?.min && numValue < this.validation.min) {
                    return next(new Error(`Value quá nhỏ. Tối thiểu ${this.validation.min}`));
                }
                break;

            case 'boolean':
                if (typeof this.value === 'string') {
                    this.value = this.value.toLowerCase() === 'true';
                } else {
                    this.value = Boolean(this.value);
                }
                break;

            case 'json':
                if (typeof this.value === 'string') {
                    try {
                        this.value = JSON.parse(this.value);
                    } catch (error) {
                        return next(new Error('Value phải là JSON hợp lệ'));
                    }
                }
                break;

            case 'url':
                if (typeof this.value !== 'string') {
                    this.value = String(this.value);
                }
                const urlPattern = /^https?:\/\/.+/;
                if (!urlPattern.test(this.value)) {
                    return next(new Error('Value phải là URL hợp lệ'));
                }
                break;

            case 'email':
                if (typeof this.value !== 'string') {
                    this.value = String(this.value);
                }
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(this.value)) {
                    return next(new Error('Value phải là email hợp lệ'));
                }
                break;
        }

        // Validate against options if provided
        if (this.validation?.options && this.validation.options.length > 0) {
            if (!this.validation.options.includes(this.value)) {
                return next(new Error(`Value phải là một trong: ${this.validation.options.join(', ')}`));
            }
        }
    }
    next();
});

// Static methods
SystemSettingSchema.statics.findByGroup = function (group: string) {
    return this.find({ group }).sort({ key: 1 });
};

SystemSettingSchema.statics.findPublicSettings = function () {
    return this.find({ isPublic: true }).sort({ group: 1, key: 1 });
};

SystemSettingSchema.statics.findRequiredSettings = function () {
    return this.find({ isRequired: true }).sort({ group: 1, key: 1 });
};

SystemSettingSchema.statics.getSetting = function (key: string) {
    return this.findOne({ key });
};

SystemSettingSchema.statics.setSetting = function (key: string, value: any, updatedBy: string) {
    return this.findOneAndUpdate(
        { key },
        { value, updatedBy },
        { upsert: true, new: true }
    );
};

SystemSettingSchema.statics.getSettingsByGroup = function (group: string) {
    return this.find({ group }).sort({ key: 1 });
};

SystemSettingSchema.statics.getAllSettings = function () {
    return this.find({}).sort({ group: 1, key: 1 });
};

SystemSettingSchema.statics.initializeDefaultSettings = async function (updatedBy: string) {
    const defaultSettings = [
        // General settings
        { key: 'site_name', value: 'MinhLoc Group', type: 'text', group: 'general', isPublic: true, isRequired: true },
        { key: 'site_description', value: 'MinhLoc Group - Bất động sản và Nhân sâm cao cấp', type: 'text', group: 'general', isPublic: true },
        { key: 'site_logo', value: '', type: 'file', group: 'general', isPublic: true },
        { key: 'site_favicon', value: '', type: 'file', group: 'general', isPublic: true },
        { key: 'site_phone', value: '', type: 'text', group: 'general', isPublic: true },
        { key: 'site_email', value: '', type: 'email', group: 'general', isPublic: true },
        { key: 'site_address', value: '', type: 'text', group: 'general', isPublic: true },

        // SEO settings
        { key: 'seo_title', value: 'MinhLoc Group', type: 'text', group: 'seo', isPublic: true },
        { key: 'seo_description', value: 'MinhLoc Group - Bất động sản và Nhân sâm cao cấp', type: 'text', group: 'seo', isPublic: true },
        { key: 'seo_keywords', value: 'bất động sản, nhân sâm, minhloc', type: 'text', group: 'seo', isPublic: true },
        { key: 'seo_og_image', value: '', type: 'file', group: 'seo', isPublic: true },

        // Email settings
        { key: 'email_host', value: '', type: 'text', group: 'email', isRequired: true },
        { key: 'email_port', value: 587, type: 'number', group: 'email', isRequired: true },
        { key: 'email_user', value: '', type: 'email', group: 'email', isRequired: true },
        { key: 'email_pass', value: '', type: 'text', group: 'email', isRequired: true },
        { key: 'email_from_name', value: 'MinhLoc Group', type: 'text', group: 'email' },
        { key: 'email_from_email', value: '', type: 'email', group: 'email' },

        // Social media settings
        { key: 'facebook_url', value: '', type: 'url', group: 'social', isPublic: true },
        { key: 'twitter_url', value: '', type: 'url', group: 'social', isPublic: true },
        { key: 'instagram_url', value: '', type: 'url', group: 'social', isPublic: true },
        { key: 'youtube_url', value: '', type: 'url', group: 'social', isPublic: true },
        { key: 'linkedin_url', value: '', type: 'url', group: 'social', isPublic: true },

        // Security settings
        { key: 'max_login_attempts', value: 5, type: 'number', group: 'security' },
        { key: 'session_timeout', value: 24, type: 'number', group: 'security' },
        { key: 'password_min_length', value: 8, type: 'number', group: 'security' },
        { key: 'enable_2fa', value: false, type: 'boolean', group: 'security' },

        // Notification settings
        { key: 'enable_email_notifications', value: true, type: 'boolean', group: 'notification' },
        { key: 'enable_sms_notifications', value: false, type: 'boolean', group: 'notification' },
        { key: 'notification_email', value: '', type: 'email', group: 'notification' },
    ];

    for (const setting of defaultSettings) {
        await this.findOneAndUpdate(
            { key: setting.key },
            { ...setting, updatedBy },
            { upsert: true }
        );
    }
};

// Instance methods
SystemSettingSchema.methods.getValue = function () {
    return this.value;
};

SystemSettingSchema.methods.setValue = function (value: any, updatedBy: string) {
    this.value = value;
    this.updatedBy = updatedBy;
    return this.save();
};

const SystemSetting = mongoose.model<ISystemSetting>('SystemSetting', SystemSettingSchema);

export default SystemSetting;
