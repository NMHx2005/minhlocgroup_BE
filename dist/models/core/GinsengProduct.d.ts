import mongoose, { Document } from 'mongoose';
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
        age?: number;
        processingMethod?: string;
        storageMethod?: string;
        certification?: string;
        ingredients?: string[];
        benefits?: string[];
        usageInstructions?: string;
        contraindications?: string;
    };
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];
    sku: string;
    barcode?: string;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    weightUnit: string;
    phone?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const GinsengProduct: mongoose.Model<IGinsengProduct, {}, {}, {}, mongoose.Document<unknown, {}, IGinsengProduct, {}, {}> & IGinsengProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default GinsengProduct;
//# sourceMappingURL=GinsengProduct.d.ts.map