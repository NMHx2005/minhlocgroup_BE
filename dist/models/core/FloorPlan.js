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
const FloorPlanSchema = new mongoose_1.Schema({
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
FloorPlanSchema.index({ projectId: 1 });
FloorPlanSchema.index({ isActive: 1 });
FloorPlanSchema.index({ sortOrder: 1 });
FloorPlanSchema.index({ price: 1 });
FloorPlanSchema.index({ area: 1 });
FloorPlanSchema.index({ projectId: 1, isActive: 1 });
FloorPlanSchema.index({ projectId: 1, sortOrder: 1 });
FloorPlanSchema.virtual('project', {
    ref: 'Project',
    localField: 'projectId',
    foreignField: '_id',
    justOne: true
});
FloorPlanSchema.virtual('priceDisplay').get(function () {
    return `${this.price.toLocaleString('vi-VN')} VND`;
});
FloorPlanSchema.virtual('areaDisplay').get(function () {
    return `${this.area} m²`;
});
FloorPlanSchema.virtual('dimensionsDisplay').get(function () {
    const { length, width, unit } = this.dimensions;
    return `${length} x ${width} ${unit}`;
});
FloorPlanSchema.virtual('roomSummary').get(function () {
    const parts = [];
    if (this.bedrooms > 0)
        parts.push(`${this.bedrooms} PN`);
    if (this.bathrooms > 0)
        parts.push(`${this.bathrooms} WC`);
    return parts.join(' - ');
});
FloorPlanSchema.statics.findByProject = function (projectId) {
    return this.find({ projectId, isActive: true }).sort({ sortOrder: 1, name: 1 });
};
FloorPlanSchema.statics.findActiveFloorPlans = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};
FloorPlanSchema.statics.findByPriceRange = function (minPrice, maxPrice) {
    return this.find({
        price: { $gte: minPrice, $lte: maxPrice },
        isActive: true
    }).sort({ price: 1 });
};
FloorPlanSchema.statics.findByAreaRange = function (minArea, maxArea) {
    return this.find({
        area: { $gte: minArea, $lte: maxArea },
        isActive: true
    }).sort({ area: 1 });
};
FloorPlanSchema.statics.findByBedrooms = function (bedrooms) {
    return this.find({
        bedrooms,
        isActive: true
    }).sort({ price: 1 });
};
const FloorPlan = mongoose_1.default.model('FloorPlan', FloorPlanSchema);
exports.default = FloorPlan;
//# sourceMappingURL=FloorPlan.js.map