import mongoose, { Document } from 'mongoose';
export interface IJobApplication extends Document {
    jobPositionId: mongoose.Types.ObjectId;
    applicantName: string;
    email: string;
    phone: string;
    cvUrl?: string;
    coverLetter?: string;
    experience: string;
    education: string;
    skills: string[];
    expectedSalary?: string;
    availableDate?: Date;
    status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected' | 'withdrawn';
    notes?: string;
    interviewDate?: Date;
    interviewNotes?: string;
    rating?: number;
    source: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const JobApplication: mongoose.Model<IJobApplication, {}, {}, {}, mongoose.Document<unknown, {}, IJobApplication, {}, {}> & IJobApplication & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default JobApplication;
//# sourceMappingURL=JobApplication.d.ts.map