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
const RoleSchema = new mongoose_1.Schema({
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
RoleSchema.index({ isActive: 1 });
RoleSchema.index({ sortOrder: 1 });
RoleSchema.index({ isSystem: 1 });
RoleSchema.virtual('userCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'roles',
    count: true
});
RoleSchema.statics.findActiveRoles = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, displayName: 1 });
};
RoleSchema.statics.findSystemRoles = function () {
    return this.find({ isSystem: true, isActive: true });
};
RoleSchema.statics.findCustomRoles = function () {
    return this.find({ isSystem: false, isActive: true });
};
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
const Role = mongoose_1.default.model('Role', RoleSchema);
exports.default = Role;
//# sourceMappingURL=Role.js.map