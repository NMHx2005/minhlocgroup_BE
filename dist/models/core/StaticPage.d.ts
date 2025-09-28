import mongoose, { Document } from 'mongoose';
export interface IStaticPage extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    template?: string;
    status: 'active' | 'inactive' | 'draft';
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string[];
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;
        canonicalUrl?: string;
    };
    isHomepage: boolean;
    isFooter: boolean;
    isHeader: boolean;
    sortOrder: number;
    parentId?: mongoose.Types.ObjectId;
    viewCount: number;
    lastViewedAt?: Date;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const StaticPage: mongoose.Model<IStaticPage, {}, {}, {}, mongoose.Document<unknown, {}, IStaticPage, {}, {}> & IStaticPage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default StaticPage;
//# sourceMappingURL=StaticPage.d.ts.map