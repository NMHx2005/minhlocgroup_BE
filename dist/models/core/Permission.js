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
const PermissionSchema = new mongoose_1.Schema({
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
PermissionSchema.index({ module: 1 });
PermissionSchema.index({ action: 1 });
PermissionSchema.index({ isActive: 1 });
PermissionSchema.index({ isSystem: 1 });
PermissionSchema.index({ module: 1, action: 1 });
PermissionSchema.index({ module: 1, isActive: 1 });
PermissionSchema.virtual('fullName').get(function () {
    if (this.resource) {
        return `${this.module}.${this.resource}.${this.action}`;
    }
    return `${this.module}.${this.action}`;
});
PermissionSchema.statics.findActivePermissions = function () {
    return this.find({ isActive: true }).sort({ module: 1, action: 1 });
};
PermissionSchema.statics.findByModule = function (module) {
    return this.find({ module, isActive: true }).sort({ action: 1 });
};
PermissionSchema.statics.findSystemPermissions = function () {
    return this.find({ isSystem: true, isActive: true });
};
PermissionSchema.statics.findCustomPermissions = function () {
    return this.find({ isSystem: false, isActive: true });
};
PermissionSchema.pre('save', function (next) {
    if (this.isNew && !this.name) {
        const parts = [this.module];
        if (this.resource)
            parts.push(this.resource);
        parts.push(this.action);
        this.name = parts.join('_');
    }
    next();
});
const Permission = mongoose_1.default.model('Permission', PermissionSchema);
exports.default = Permission;
//# sourceMappingURL=Permission.js.map