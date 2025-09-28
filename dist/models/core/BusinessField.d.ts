import mongoose, { Document } from 'mongoose';
export interface IBusinessField extends Document {
    name: string;
    slug: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    image: string;
    features: string[];
    projects: Array<{
        name: string;
        scale: string;
        status: 'completed' | 'in_progress' | 'planning' | 'sold_out' | 'coming_soon';
        description?: string;
        image?: string;
    }>;
    stats: {
        projects?: string;
        area?: string;
        experience?: string;
        return?: string;
        clients?: string;
        properties?: string;
    };
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
interface IBusinessFieldModel extends mongoose.Model<IBusinessField> {
    findBySlug(slug: string): Promise<IBusinessField | null>;
}
declare const BusinessField: IBusinessFieldModel;
export default BusinessField;
//# sourceMappingURL=BusinessField.d.ts.map