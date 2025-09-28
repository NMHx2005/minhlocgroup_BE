import mongoose, { Document } from 'mongoose';
export interface IConsultationRequest extends Document {
    customerId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    serviceType: 'real_estate' | 'ginseng' | 'general';
    interestIn?: {
        type: 'project' | 'product';
        id: mongoose.Types.ObjectId;
        name: string;
    };
    budgetRange?: string;
    preferredContactTime?: string;
    message: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'closed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    assignedTo?: mongoose.Types.ObjectId;
    notes?: string;
    followUpDate?: Date;
    source: 'website' | 'facebook' | 'phone' | 'referral' | 'ads' | 'other';
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    ipAddress?: string;
    userAgent?: string;
    attachments?: string[];
    tags: string[];
    estimatedValue?: number;
    conversionProbability?: number;
    lastContactAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const ConsultationRequest: mongoose.Model<IConsultationRequest, {}, {}, {}, mongoose.Document<unknown, {}, IConsultationRequest, {}, {}> & IConsultationRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ConsultationRequest;
//# sourceMappingURL=ConsultationRequest.d.ts.map