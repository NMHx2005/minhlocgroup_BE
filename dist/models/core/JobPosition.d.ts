import mongoose, { Document } from 'mongoose';
export interface IJobPosition extends Document {
    title: string;
    slug: string;
    department: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    salary: string;
    experience: string;
    deadline: Date;
    description: string;
    requirements: string[];
    benefits: string[];
    responsibilities: string[];
    skills: string[];
    isHot: boolean;
    isUrgent: boolean;
    isActive: boolean;
    status: 'draft' | 'published' | 'closed' | 'cancelled';
    priority: number;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const JobPosition: mongoose.Model<IJobPosition, {}, {}, {}, mongoose.Document<unknown, {}, IJobPosition, {}, {}> & IJobPosition & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default JobPosition;
//# sourceMappingURL=JobPosition.d.ts.map