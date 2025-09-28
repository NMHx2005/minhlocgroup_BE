import mongoose, { Document } from 'mongoose';
export interface INewsCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    color: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const NewsCategory: mongoose.Model<INewsCategory, {}, {}, {}, mongoose.Document<unknown, {}, INewsCategory, {}, {}> & INewsCategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default NewsCategory;
//# sourceMappingURL=NewsCategory.d.ts.map