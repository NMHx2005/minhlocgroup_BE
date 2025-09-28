import mongoose, { Document } from 'mongoose';
export interface IEmailTemplate extends Document {
    name: string;
    subject: string;
    content: string;
    type: 'welcome' | 'newsletter' | 'notification' | 'transactional' | 'marketing' | 'custom';
    variables: string[];
    isActive: boolean;
    isSystem: boolean;
    previewText?: string;
    fromName?: string;
    fromEmail?: string;
    replyToEmail?: string;
    ccEmails?: string[];
    bccEmails?: string[];
    attachments?: string[];
    settings: {
        trackOpens: boolean;
        trackClicks: boolean;
        trackUnsubscribes: boolean;
        enablePlainText: boolean;
        enableHtml: boolean;
    };
    usageCount: number;
    lastUsedAt?: Date;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const EmailTemplate: mongoose.Model<IEmailTemplate, {}, {}, {}, mongoose.Document<unknown, {}, IEmailTemplate, {}, {}> & IEmailTemplate & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default EmailTemplate;
//# sourceMappingURL=EmailTemplate.d.ts.map