import mongoose, { Document, Schema } from 'mongoose';

export interface IGinsengProduct extends Document {
    name: string;
    slug: string;
    description: string;
    content: string;
    categoryId: mongoose.Types.ObjectId;
    originId: mongoose.Types.ObjectId;
    grade: 'premium' | 'standard' | 'economy';
    weight: number;
    price: number;
    salePrice?: number;
    stock: number;
    status: 'active' | 'inactive' | 'out_of_stock';
    images: string[];
    features: string[];
    specifications: {
        age?: number; // Tuổi nhân sâm (năm)
        processingMethod?: string; // Phương pháp chế biến
        storageMethod?: string; // Phương pháp bảo quản
        certification?: string; // Chứng nhận chất lượng
        ingredients?: string[]; // Thành phần
        benefits?: string[]; // Công dụng
        usageInstructions?: string; // Hướng dẫn sử dụng
        contraindications?: string; // Chống chỉ định
    };
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];
    sku: string; // Stock Keeping Unit
    barcode?: string;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    weightUnit: string;
    phone?: string; // Số điện thoại liên hệ
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const GinsengProductSchema = new Schema<IGinsengProduct>({
    name: {
        type: String,
        required: [true, 'Tên sản phẩm là bắt buộc'],
        trim: true,
        minlength: [3, 'Tên sản phẩm phải có ít nhất 3 ký tự'],
        maxlength: [200, 'Tên sản phẩm không được quá 200 ký tự']
    },
    slug: {
        type: String,
        required: [true, 'Slug là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang'
        ]
    },
    description: {
        type: String,
        required: [true, 'Mô tả sản phẩm là bắt buộc'],
        trim: true,
        minlength: [20, 'Mô tả phải có ít nhất 20 ký tự'],
        maxlength: [2000, 'Mô tả không được quá 2000 ký tự']
    },
    content: {
        type: String,
        required: [true, 'Nội dung sản phẩm là bắt buộc'],
        minlength: [50, 'Nội dung phải có ít nhất 50 ký tự']
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'GinsengCategory',
        required: [true, 'Danh mục sản phẩm là bắt buộc']
    },
    originId: {
        type: Schema.Types.ObjectId,
        ref: 'GinsengOrigin',
        required: [true, 'Xuất xứ là bắt buộc']
    },
    grade: {
        type: String,
        required: [true, 'Cấp độ sản phẩm là bắt buộc'],
        enum: {
            values: ['premium', 'standard', 'economy'],
            message: 'Cấp độ phải là premium, standard hoặc economy'
        }
    },
    weight: {
        type: Number,
        required: [true, 'Trọng lượng là bắt buộc'],
        min: [0.1, 'Trọng lượng phải ít nhất 0.1'],
        max: [1000, 'Trọng lượng không được quá 1000']
    },
    price: {
        type: Number,
        required: [true, 'Giá sản phẩm là bắt buộc'],
        min: [0, 'Giá sản phẩm không được âm']
    },
    stock: {
        type: Number,
        required: [true, 'Số lượng tồn kho là bắt buộc'],
        min: [0, 'Số lượng tồn kho không được âm'],
        default: 0
    },
    status: {
        type: String,
        required: [true, 'Trạng thái sản phẩm là bắt buộc'],
        enum: {
            values: ['active', 'inactive', 'out_of_stock'],
            message: 'Trạng thái phải là active, inactive hoặc out_of_stock'
        },
        default: 'active'
    },
    images: [{
        type: String,
        trim: true,
        validate: {
            validator: function (url: string) {
                if (!url || url === '') return false;

                // Accept base64 data URLs
                if (url.startsWith('data:image/')) {
                    return true;
                }

                // Accept HTTP/HTTPS URLs with various image formats and transformations
                try {
                    const urlObj = new URL(url);
                    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                        return false;
                    }

                    // Check if it's a valid image URL (supports Cloudinary, placeholder, etc.)
                    return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(urlObj.pathname) ||
                        /via\.placeholder\.com/.test(url) ||
                        /res\.cloudinary\.com/.test(url) ||
                        /images\.unsplash\.com/.test(url) ||
                        /picsum\.photos/.test(url);
                } catch {
                    return false;
                }
            },
            message: 'URL hình ảnh không hợp lệ'
        }
    }],
    features: [{
        type: String,
        trim: true,
        maxlength: [100, 'Mỗi tính năng không được quá 100 ký tự']
    }],
    specifications: {
        age: {
            type: Number,
            min: [1, 'Tuổi nhân sâm phải ít nhất 1 năm'],
            max: [100, 'Tuổi nhân sâm không được quá 100 năm']
        },
        processingMethod: {
            type: String,
            trim: true,
            maxlength: [200, 'Phương pháp chế biến không được quá 200 ký tự']
        },
        storageMethod: {
            type: String,
            trim: true,
            maxlength: [200, 'Phương pháp bảo quản không được quá 200 ký tự']
        },
        certification: {
            type: String,
            trim: true,
            maxlength: [200, 'Chứng nhận không được quá 200 ký tự']
        },
        ingredients: [{
            type: String,
            trim: true,
            maxlength: [100, 'Mỗi thành phần không được quá 100 ký tự']
        }],
        benefits: [{
            type: String,
            trim: true,
            maxlength: [200, 'Mỗi công dụng không được quá 200 ký tự']
        }],
        usageInstructions: {
            type: String,
            trim: true,
            maxlength: [1000, 'Hướng dẫn sử dụng không được quá 1000 ký tự']
        },
        contraindications: {
            type: String,
            trim: true,
            maxlength: [500, 'Chống chỉ định không được quá 500 ký tự']
        }
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Mỗi tag không được quá 50 ký tự']
    }],
    sku: {
        type: String,
        required: [true, 'Mã SKU là bắt buộc'],
        unique: true,
        trim: true,
        uppercase: true,
        match: [
            /^[A-Z0-9\-_]+$/,
            'Mã SKU chỉ được chứa chữ cái, số, dấu gạch ngang và gạch dưới'
        ]
    },
    barcode: {
        type: String,
        trim: true,
        match: [
            /^[0-9]{8,14}$/,
            'Mã vạch phải có 8-14 chữ số'
        ]
    },
    dimensions: {
        length: {
            type: Number,
            min: [0, 'Chiều dài không được âm']
        },
        width: {
            type: Number,
            min: [0, 'Chiều rộng không được âm']
        },
        height: {
            type: Number,
            min: [0, 'Chiều cao không được âm']
        },
        unit: {
            type: String,
            enum: {
                values: ['cm', 'mm', 'inch'],
                message: 'Đơn vị kích thước phải là cm, mm hoặc inch'
            },
            default: 'cm'
        }
    },
    weightUnit: {
        type: String,
        required: [true, 'Đơn vị trọng lượng là bắt buộc'],
        enum: {
            values: ['g', 'kg', 'oz', 'lb'],
            message: 'Đơn vị trọng lượng phải là g, kg, oz hoặc lb'
        },
        default: 'g'
    },
    phone: {
        type: String,
        trim: true,
        match: [
            /^(\+84|84|0)[1-9][0-9]{8,9}$/,
            'Số điện thoại không hợp lệ'
        ]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo là bắt buộc']
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người cập nhật là bắt buộc']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
GinsengProductSchema.index({ name: 'text', description: 'text' });
GinsengProductSchema.index({ category: 1 });
GinsengProductSchema.index({ grade: 1 });
GinsengProductSchema.index({ status: 1 });
GinsengProductSchema.index({ isActive: 1 });
GinsengProductSchema.index({ isFeatured: 1 });
// Note: sku index is automatically created by unique: true
GinsengProductSchema.index({ barcode: 1 });
GinsengProductSchema.index({ price: 1 });
GinsengProductSchema.index({ stock: 1 });
GinsengProductSchema.index({ createdAt: -1 });
GinsengProductSchema.index({ tags: 1 });

// Compound indexes
GinsengProductSchema.index({ category: 1, status: 1, isActive: 1 });
GinsengProductSchema.index({ grade: 1, status: 1, isActive: 1 });
GinsengProductSchema.index({ isFeatured: 1, isActive: 1 });
GinsengProductSchema.index({ price: 1, status: 1 });

// Virtual for price display
GinsengProductSchema.virtual('priceDisplay').get(function () {
    return `${this.price.toLocaleString('vi-VN')} VND`;
});

// Virtual for weight display
GinsengProductSchema.virtual('weightDisplay').get(function () {
    return `${this.weight} ${this.weightUnit}`;
});

// Virtual for dimensions display
GinsengProductSchema.virtual('dimensionsDisplay').get(function () {
    if (!this.dimensions) return null;
    const { length, width, height, unit } = this.dimensions;
    return `${length} x ${width} x ${height} ${unit}`;
});

// Virtual for stock status
GinsengProductSchema.virtual('stockStatus').get(function () {
    if (this.stock === 0) return 'Hết hàng';
    if (this.stock < 10) return 'Sắp hết hàng';
    return 'Còn hàng';
});

// Pre-save middleware to update status based on stock
GinsengProductSchema.pre('save', function (next) {
    if (this.isModified('stock')) {
        if (this.stock === 0) {
            this.status = 'out_of_stock';
        } else if (this.status === 'out_of_stock' && this.stock > 0) {
            this.status = 'active';
        }
    }
    next();
});

// Pre-save middleware to generate SKU if not provided
GinsengProductSchema.pre('save', function (next) {
    if (!this.sku) {
        const prefix = 'GIN'; // Default prefix for ginseng products
        const timestamp = Date.now().toString().slice(-6);
        this.sku = `${prefix}-${timestamp}`;
    }
    next();
});

// Static method to find active products
GinsengProductSchema.statics.findActiveProducts = function () {
    return this.find({ isActive: true, status: 'active' });
};

// Static method to find featured products
GinsengProductSchema.statics.findFeaturedProducts = function () {
    return this.find({ isFeatured: true, isActive: true, status: 'active' });
};

// Static method to find by category
GinsengProductSchema.statics.findByCategory = function (categoryId: string) {
    return this.find({ categoryId, isActive: true, status: 'active' });
};

// Static method to find by grade
GinsengProductSchema.statics.findByGrade = function (grade: string) {
    return this.find({ grade, isActive: true, status: 'active' });
};

// Static method to find in stock products
GinsengProductSchema.statics.findInStockProducts = function () {
    return this.find({
        isActive: true,
        status: 'active',
        stock: { $gt: 0 }
    });
};

// Static method to search products
GinsengProductSchema.statics.searchProducts = function (query: string) {
    return this.find({
        $text: { $search: query },
        isActive: true,
        status: 'active'
    });
};

// Static method to find products by price range
GinsengProductSchema.statics.findByPriceRange = function (minPrice: number, maxPrice: number) {
    return this.find({
        price: { $gte: minPrice, $lte: maxPrice },
        isActive: true,
        status: 'active'
    });
};

// Static method to find low stock products
GinsengProductSchema.statics.findLowStockProducts = function (threshold: number = 10) {
    return this.find({
        stock: { $gt: 0, $lte: threshold },
        isActive: true,
        status: 'active'
    });
};

// Export the model
const GinsengProduct = mongoose.model<IGinsengProduct>('GinsengProduct', GinsengProductSchema);

export default GinsengProduct;
