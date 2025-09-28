import mongoose, { Document } from 'mongoose';
export interface IBanner extends Document {
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    mobileImage?: string;
    linkUrl?: string;
    linkText?: string;
    position: 'hero' | 'sidebar' | 'footer' | 'popup' | 'notification';
    sortOrder: number;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
    targetAudience?: {
        userTypes?: string[];
        locations?: string[];
        devices?: string[];
        [key: string]: any;
    };
    clickCount: number;
    impressionCount: number;
    ctr: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Banner: mongoose.Model<IBanner, {}, {}, {}, mongoose.Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Banner;
//# sourceMappingURL=Banner.d.ts.map