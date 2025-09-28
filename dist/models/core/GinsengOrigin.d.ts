import mongoose, { Document } from 'mongoose';
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
declare const GinsengOrigin: mongoose.Model<IGinsengOrigin, {}, {}, {}, mongoose.Document<unknown, {}, IGinsengOrigin, {}, {}> & IGinsengOrigin & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default GinsengOrigin;
//# sourceMappingURL=GinsengOrigin.d.ts.map