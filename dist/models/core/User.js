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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Tên là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
        maxlength: [100, 'Tên không được quá 100 ký tự']
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Email không hợp lệ'
        ]
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false
    },
    phone: {
        type: String,
        trim: true,
        match: [
            /^[\+]?[1-9][\d]{0,15}$/,
            'Số điện thoại không hợp lệ'
        ]
    },
    address: {
        type: String,
        trim: true,
        maxlength: [500, 'Địa chỉ không được quá 500 ký tự']
    },
    company: {
        type: String,
        trim: true,
        maxlength: [200, 'Tên công ty không được quá 200 ký tự']
    },
    type: {
        type: String,
        enum: {
            values: ['individual', 'business'],
            message: 'Loại người dùng phải là individual hoặc business'
        },
        default: 'individual'
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive', 'blocked'],
            message: 'Trạng thái phải là active, inactive hoặc blocked'
        },
        default: 'active'
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'editor', 'viewer', 'customer'],
            message: 'Vai trò phải là admin, editor, viewer hoặc customer'
        },
        default: 'customer'
    },
    roles: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Role'
        }],
    permissions: [{
            type: String,
            trim: true
        }],
    avatar: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
            'URL avatar không hợp lệ'
        ]
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Ghi chú không được quá 1000 ký tự']
    },
    interests: [{
            type: String,
            trim: true,
            maxlength: [50, 'Mỗi sở thích không được quá 50 ký tự']
        }],
    totalOrders: {
        type: Number,
        default: 0,
        min: [0, 'Tổng đơn hàng không được âm']
    },
    totalSpent: {
        type: Number,
        default: 0,
        min: [0, 'Tổng chi tiêu không được âm']
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ type: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastActivity: -1 });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ type: 1, status: 1 });
UserSchema.virtual('fullName').get(function () {
    return this.name;
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
UserSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.lastActivity = new Date();
    }
    next();
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw new Error('Lỗi khi so sánh mật khẩu');
    }
};
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};
UserSchema.statics.findActiveUsers = function () {
    return this.find({ status: 'active' });
};
UserSchema.statics.findByRole = function (role) {
    return this.find({ role, status: 'active' });
};
UserSchema.statics.findBusinessUsers = function () {
    return this.find({ type: 'business', status: 'active' });
};
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
