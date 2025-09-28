import mongoose, { Document, Schema } from 'mongoose';

export interface IGinsengOrigin extends Document {
    name: string;
    country: string;
    region?: string;
    description?: string;
    flagImage?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    isActive: boolean;
    sortOrder: number;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GinsengOriginSchema = new Schema<IGinsengOrigin>({
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

// Indexes
GinsengOriginSchema.index({ name: 1 });
GinsengOriginSchema.index({ country: 1 });
GinsengOriginSchema.index({ isActive: 1 });
GinsengOriginSchema.index({ sortOrder: 1 });

// Compound indexes
GinsengOriginSchema.index({ country: 1, isActive: 1 });
GinsengOriginSchema.index({ isActive: 1, sortOrder: 1 });

// Virtual for product count
GinsengOriginSchema.virtual('productCount', {
    ref: 'GinsengProduct',
    localField: '_id',
    foreignField: 'originId',
    count: true
});

// Virtual for full location
GinsengOriginSchema.virtual('fullLocation').get(function () {
    if (this.region) {
        return `${this.region}, ${this.country}`;
    }
    return this.country;
});

// Virtual for coordinates display
GinsengOriginSchema.virtual('coordinatesDisplay').get(function () {
    if (!this.coordinates) return null;
    const { latitude, longitude } = this.coordinates;
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
});

// Pre-save middleware to set meta fields
GinsengOriginSchema.pre('save', function (next) {
    if (!this.metaTitle) {
        this.metaTitle = `${this.name} - ${this.country}`;
    }
    if (!this.metaDescription && this.description) {
        this.metaDescription = this.description.substring(0, 160);
    }
    next();
});

// Static methods
GinsengOriginSchema.statics.findActiveOrigins = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, country: 1, name: 1 });
};

GinsengOriginSchema.statics.findByCountry = function (country: string) {
    return this.find({ country, isActive: true }).sort({ name: 1 });
};

GinsengOriginSchema.statics.findByRegion = function (region: string) {
    return this.find({ region, isActive: true }).sort({ name: 1 });
};

GinsengOriginSchema.statics.searchOrigins = function (query: string) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } },
            { region: { $regex: query, $options: 'i' } }
        ],
        isActive: true
    }).sort({ country: 1, name: 1 });
};

const GinsengOrigin = mongoose.model<IGinsengOrigin>('GinsengOrigin', GinsengOriginSchema);

export default GinsengOrigin;
