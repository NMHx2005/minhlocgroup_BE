import mongoose, { Document } from 'mongoose';
export interface ICompanyInfo extends Document {
    section: 'general' | 'history' | 'competitiveness' | 'system' | 'partners' | 'social_activities';
    title: string;
    content: string;
    images?: string[];
    data?: {
        milestones?: Array<{
            year: string;
            event: string;
            description?: string;
        }>;
        strengths?: Array<{
            title: string;
            description: string;
            icon: string;
            color: string;
        }>;
        businessAreas?: Array<{
            name: string;
            description: string;
            items: string[];
            color: string;
        }>;
        network?: Array<{
            city: string;
            projects: number;
            staff: number;
        }>;
        partners?: Array<{
            name: string;
            type: string;
            logo?: string;
        }>;
        activities?: Array<{
            title: string;
            description: string;
            image?: string;
        }>;
        achievements?: Array<{
            number: string;
            label: string;
        }>;
    };
    isActive: boolean;
    sortOrder: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
interface ICompanyInfoModel extends mongoose.Model<ICompanyInfo> {
    findBySection(section: string): Promise<ICompanyInfo | null>;
    findActiveSections(): Promise<ICompanyInfo[]>;
}
declare const CompanyInfo: ICompanyInfoModel;
export default CompanyInfo;
//# sourceMappingURL=CompanyInfo.d.ts.map