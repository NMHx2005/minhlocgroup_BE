import mongoose, { Document, Schema } from 'mongoose';

export interface IFloorPlan extends Document {
    projectId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    price: number;
    image: string;
    floorPlanImage: string;
    dimensions: {
        length: number;
        width: number;
        unit: string;
    };
    features: string[];
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const FloorPlanSchema = new Schema<IFloorPlan>({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'ID dự án là bắt buộc']
    },
    name: {
        type: String,
        required: [true, 'Tên mặt bằng là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên mặt bằng phải có ít nhất 2 ký tự'],
        maxlength: [200, 'Tên mặt bằng không được quá 200 ký tự']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
    },
    area: {
        type: Number,
        required: [true, 'Diện tích là bắt buộc'],
        min: [0, 'Diện tích không được âm']
    },
    bedrooms: {
        type: Number,
        required: [true, 'Số phòng ngủ là bắt buộc'],
        min: [0, 'Số phòng ngủ không được âm'],
        max: [10, 'Số phòng ngủ không được quá 10']
    },
    bathrooms: {
        type: Number,
        required: [true, 'Số phòng tắm là bắt buộc'],
        min: [0, 'Số phòng tắm không được âm'],
        max: [10, 'Số phòng tắm không được quá 10']
    },
    price: {
        type: Number,
        required: [true, 'Giá là bắt buộc'],
        min: [0, 'Giá không được âm']
    },
    image: {
        type: String,
        required: [true, 'Hình ảnh là bắt buộc'],
        trim: true,
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
            'URL hình ảnh không hợp lệ'
        ]
    },
    floorPlanImage: {
        type: String,
        required: [true, 'Hình ảnh mặt bằng là bắt buộc'],
        trim: true,
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
            'URL hình ảnh mặt bằng không hợp lệ'
        ]
    },
    dimensions: {
        length: {
            type: Number,
            required: [true, 'Chiều dài là bắt buộc'],
            min: [0, 'Chiều dài không được âm']
        },
        width: {
            type: Number,
            required: [true, 'Chiều rộng là bắt buộc'],
            min: [0, 'Chiều rộng không được âm']
        },
        unit: {
            type: String,
            required: [true, 'Đơn vị là bắt buộc'],
            enum: {
                values: ['m', 'ft'],
                message: 'Đơn vị phải là m hoặc ft'
            },
            default: 'm'
        }
    },
    features: [{
        type: String,
        trim: true,
        maxlength: [100, 'Mỗi tính năng không được quá 100 ký tự']
    }],
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
FloorPlanSchema.index({ projectId: 1 });
FloorPlanSchema.index({ isActive: 1 });
FloorPlanSchema.index({ sortOrder: 1 });
FloorPlanSchema.index({ price: 1 });
FloorPlanSchema.index({ area: 1 });

// Compound indexes
FloorPlanSchema.index({ projectId: 1, isActive: 1 });
FloorPlanSchema.index({ projectId: 1, sortOrder: 1 });

// Virtual for project
FloorPlanSchema.virtual('project', {
    ref: 'Project',
    localField: 'projectId',
    foreignField: '_id',
    justOne: true
});

// Virtual for price display
FloorPlanSchema.virtual('priceDisplay').get(function () {
    return `${this.price.toLocaleString('vi-VN')} VND`;
});

// Virtual for area display
FloorPlanSchema.virtual('areaDisplay').get(function () {
    return `${this.area} m²`;
});

// Virtual for dimensions display
FloorPlanSchema.virtual('dimensionsDisplay').get(function () {
    const { length, width, unit } = this.dimensions;
    return `${length} x ${width} ${unit}`;
});

// Virtual for room summary
FloorPlanSchema.virtual('roomSummary').get(function () {
    const parts = [];
    if (this.bedrooms > 0) parts.push(`${this.bedrooms} PN`);
    if (this.bathrooms > 0) parts.push(`${this.bathrooms} WC`);
    return parts.join(' - ');
});

// Static methods
FloorPlanSchema.statics.findByProject = function (projectId: string) {
    return this.find({ projectId, isActive: true }).sort({ sortOrder: 1, name: 1 });
};

FloorPlanSchema.statics.findActiveFloorPlans = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

FloorPlanSchema.statics.findByPriceRange = function (minPrice: number, maxPrice: number) {
    return this.find({
        price: { $gte: minPrice, $lte: maxPrice },
        isActive: true
    }).sort({ price: 1 });
};

FloorPlanSchema.statics.findByAreaRange = function (minArea: number, maxArea: number) {
    return this.find({
        area: { $gte: minArea, $lte: maxArea },
        isActive: true
    }).sort({ area: 1 });
};

FloorPlanSchema.statics.findByBedrooms = function (bedrooms: number) {
    return this.find({
        bedrooms,
        isActive: true
    }).sort({ price: 1 });
};

const FloorPlan = mongoose.model<IFloorPlan>('FloorPlan', FloorPlanSchema);

export default FloorPlan;
