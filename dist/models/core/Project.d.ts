import mongoose, { Document } from 'mongoose';
export interface IProject extends Document {
    name: string;
    slug: string;
    description: string;
    content: string;
    location: string;
    type: 'apartment' | 'villa' | 'office' | 'commercial';
    status: 'planning' | 'construction' | 'completed' | 'sold_out';
    price: {
        min: number;
        max: number;
        currency: string;
    };
    area: {
        min: number;
        max: number;
        unit: string;
    };
    images: string[];
    features: string[];
    amenities: string[];
    developer: string;
    phone?: string;
    completionDate?: Date;
    totalUnits: number;
    soldUnits: number;
    salesRate: number;
    revenue: number;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Project;
//# sourceMappingURL=Project.d.ts.map