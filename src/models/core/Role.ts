import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
    name: string;
    displayName: string;
    description?: string;
    permissions: string[];
    isSystem: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: [true, 'Tên vai trò là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[a-z0-9_]+$/,
            'Tên vai trò chỉ được chứa chữ cái thường, số và dấu gạch dưới'
        ]
    },
    displayName: {
        type: String,
        required: [true, 'Tên hiển thị là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên hiển thị phải có ít nhất 2 ký tự'],
        maxlength: [100, 'Tên hiển thị không được quá 100 ký tự']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },
    permissions: [{
        type: String,
        trim: true,
        match: [
            /^[a-z0-9_]+$/,
            'Tên quyền chỉ được chứa chữ cái thường, số và dấu gạch dưới'
        ]
    }],
    isSystem: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0,
        min: [0, 'Thứ tự sắp xếp không được âm']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// Note: name index is automatically created by unique: true
RoleSchema.index({ isActive: 1 });
RoleSchema.index({ sortOrder: 1 });
RoleSchema.index({ isSystem: 1 });

// Virtual for user count
RoleSchema.virtual('userCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'roles',
    count: true
});

// Static methods
RoleSchema.statics.findActiveRoles = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, displayName: 1 });
};

RoleSchema.statics.findSystemRoles = function () {
    return this.find({ isSystem: true, isActive: true });
};

RoleSchema.statics.findCustomRoles = function () {
    return this.find({ isSystem: false, isActive: true });
};

// Pre-save middleware
RoleSchema.pre('save', function (next) {
    if (this.isNew && !this.name) {
        this.name = this.displayName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_');
    }
    next();
});

const Role = mongoose.model<IRole>('Role', RoleSchema);

export default Role;
