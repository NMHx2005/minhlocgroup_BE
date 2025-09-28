import mongoose, { Document } from 'mongoose';
export interface INewsArticle extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    categoryId: mongoose.Types.ObjectId;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    author: {
        id: mongoose.Types.ObjectId;
        name: string;
    };
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };
    social: {
        facebookTitle?: string;
        facebookDescription?: string;
        twitterTitle?: string;
        twitterDescription?: string;
    };
    statistics: {
        views: number;
        likes: number;
        shares: number;
        comments: number;
    };
    isFeatured: boolean;
    isBreaking: boolean;
    allowComments: boolean;
    readingTime: number;
    wordCount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const NewsArticle: mongoose.Model<INewsArticle, {}, {}, {}, mongoose.Document<unknown, {}, INewsArticle, {}, {}> & INewsArticle & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default NewsArticle;
//# sourceMappingURL=NewsArticle.d.ts.map