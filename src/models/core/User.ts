import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    company?: string;
    type: 'individual' | 'business';
    status: 'active' | 'inactive' | 'blocked';
    role: 'admin' | 'editor' | 'viewer' | 'customer';
    roles?: mongoose.Types.ObjectId[];
    permissions?: string[];
    avatar?: string;
    notes?: string;
    interests?: string[];
    totalOrders: number;
    totalSpent: number;
    lastActivity: Date;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;

    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>;
    toJSON(): any;
}

const UserSchema = new Schema<IUser>({
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
        select: false // Không trả về password trong query mặc định
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
        type: Schema.Types.ObjectId,
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

// Indexes for performance
// Note: email index is automatically created by unique: true
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ type: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastActivity: -1 });

// Compound indexes
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ type: 1, status: 1 });

// Virtual for full name (if needed)
UserSchema.virtual('fullName').get(function () {
    return this.name;
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
    // Only hash password if it's modified
    if (!this.isModified('password')) return next();

    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Pre-save middleware to update lastActivity
UserSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.lastActivity = new Date();
    }
    next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Lỗi khi so sánh mật khẩu');
    }
};

// Override toJSON to remove sensitive data
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

// Static method to find active users
UserSchema.statics.findActiveUsers = function () {
    return this.find({ status: 'active' });
};

// Static method to find by role
UserSchema.statics.findByRole = function (role: string) {
    return this.find({ role, status: 'active' });
};

// Static method to find business users
UserSchema.statics.findBusinessUsers = function () {
    return this.find({ type: 'business', status: 'active' });
};

// Export the model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
