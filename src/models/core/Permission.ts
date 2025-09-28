import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
    name: string;
    displayName: string;
    description?: string;
    module: string;
    action: string;
    resource?: string;
    isSystem: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>({
    name: {
        type: String,
        required: [true, 'Tên quyền là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[a-z0-9_]+$/,
            'Tên quyền chỉ được chứa chữ cái thường, số và dấu gạch dưới'
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
    module: {
        type: String,
        required: [true, 'Module là bắt buộc'],
        trim: true,
        enum: {
            values: [
                'dashboard', 'users', 'projects', 'products', 'news',
                'contacts', 'settings', 'analytics', 'files', 'system'
            ],
            message: 'Module không hợp lệ'
        }
    },
    action: {
        type: String,
        required: [true, 'Hành động là bắt buộc'],
        trim: true,
        enum: {
            values: ['create', 'read', 'update', 'delete', 'manage', 'export', 'import'],
            message: 'Hành động không hợp lệ'
        }
    },
    resource: {
        type: String,
        trim: true,
        maxlength: [50, 'Tên tài nguyên không được quá 50 ký tự']
    },
    isSystem: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// Note: name index is automatically created by unique: true
PermissionSchema.index({ module: 1 });
PermissionSchema.index({ action: 1 });
PermissionSchema.index({ isActive: 1 });
PermissionSchema.index({ isSystem: 1 });

// Compound indexes
PermissionSchema.index({ module: 1, action: 1 });
PermissionSchema.index({ module: 1, isActive: 1 });

// Virtual for full permission name
PermissionSchema.virtual('fullName').get(function () {
    if (this.resource) {
        return `${this.module}.${this.resource}.${this.action}`;
    }
    return `${this.module}.${this.action}`;
});

// Static methods
PermissionSchema.statics.findActivePermissions = function () {
    return this.find({ isActive: true }).sort({ module: 1, action: 1 });
};

PermissionSchema.statics.findByModule = function (module: string) {
    return this.find({ module, isActive: true }).sort({ action: 1 });
};

PermissionSchema.statics.findSystemPermissions = function () {
    return this.find({ isSystem: true, isActive: true });
};

PermissionSchema.statics.findCustomPermissions = function () {
    return this.find({ isSystem: false, isActive: true });
};

// Pre-save middleware
PermissionSchema.pre('save', function (next) {
    if (this.isNew && !this.name) {
        const parts = [this.module];
        if (this.resource) parts.push(this.resource);
        parts.push(this.action);
        this.name = parts.join('_');
    }
    next();
});

const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);

export default Permission;
