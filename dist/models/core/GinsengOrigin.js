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
const GinsengOriginSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Tên xuất xứ là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên xuất xứ phải có ít nhất 2 ký tự'],
        maxlength: [100, 'Tên xuất xứ không được quá 100 ký tự']
    },
    country: {
        type: String,
        required: [true, 'Quốc gia là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên quốc gia phải có ít nhất 2 ký tự'],
        maxlength: [100, 'Tên quốc gia không được quá 100 ký tự']
    },
    region: {
        type: String,
        trim: true,
        maxlength: [100, 'Tên vùng miền không được quá 100 ký tự']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
    },
    flagImage: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
            'URL hình ảnh cờ không hợp lệ'
        ]
    },
    coordinates: {
        latitude: {
            type: Number,
            min: [-90, 'Vĩ độ phải từ -90 đến 90'],
            max: [90, 'Vĩ độ phải từ -90 đến 90']
        },
        longitude: {
            type: Number,
            min: [-180, 'Kinh độ phải từ -180 đến 180'],
            max: [180, 'Kinh độ phải từ -180 đến 180']
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0,
        min: [0, 'Thứ tự sắp xếp không được âm']
    },
    metaTitle: {
        type: String,
        trim: true,
        maxlength: [60, 'Meta title không được quá 60 ký tự']
    },
    metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'Meta description không được quá 160 ký tự']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
GinsengOriginSchema.index({ name: 1 });
GinsengOriginSchema.index({ country: 1 });
GinsengOriginSchema.index({ isActive: 1 });
GinsengOriginSchema.index({ sortOrder: 1 });
GinsengOriginSchema.index({ country: 1, isActive: 1 });
GinsengOriginSchema.index({ isActive: 1, sortOrder: 1 });
GinsengOriginSchema.virtual('productCount', {
    ref: 'GinsengProduct',
    localField: '_id',
    foreignField: 'originId',
    count: true
});
GinsengOriginSchema.virtual('fullLocation').get(function () {
    if (this.region) {
        return `${this.region}, ${this.country}`;
    }
    return this.country;
});
GinsengOriginSchema.virtual('coordinatesDisplay').get(function () {
    if (!this.coordinates)
        return null;
    const { latitude, longitude } = this.coordinates;
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
});
GinsengOriginSchema.pre('save', function (next) {
    if (!this.metaTitle) {
        this.metaTitle = `${this.name} - ${this.country}`;
    }
    if (!this.metaDescription && this.description) {
        this.metaDescription = this.description.substring(0, 160);
    }
    next();
});
GinsengOriginSchema.statics.findActiveOrigins = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, country: 1, name: 1 });
};
GinsengOriginSchema.statics.findByCountry = function (country) {
    return this.find({ country, isActive: true }).sort({ name: 1 });
};
GinsengOriginSchema.statics.findByRegion = function (region) {
    return this.find({ region, isActive: true }).sort({ name: 1 });
};
GinsengOriginSchema.statics.searchOrigins = function (query) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } },
            { region: { $regex: query, $options: 'i' } }
        ],
        isActive: true
    }).sort({ country: 1, name: 1 });
};
const GinsengOrigin = mongoose_1.default.model('GinsengOrigin', GinsengOriginSchema);
exports.default = GinsengOrigin;
//# sourceMappingURL=GinsengOrigin.js.map