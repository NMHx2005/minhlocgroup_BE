import mongoose, { Document } from 'mongoose';
export interface IGinsengCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: mongoose.Types.ObjectId;
    sortOrder: number;
    isActive: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const GinsengCategory: mongoose.Model<IGinsengCategory, {}, {}, {}, mongoose.Document<unknown, {}, IGinsengCategory, {}, {}> & IGinsengCategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default GinsengCategory;
//# sourceMappingURL=GinsengCategory.d.ts.map