import mongoose, { Document } from 'mongoose';
export interface INewsletterCampaign extends Document {
    name: string;
    subject: string;
    content: string;
    templateId?: mongoose.Types.ObjectId;
    recipients: {
        total: number;
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
        bounced: number;
        unsubscribed: number;
        complained: number;
    };
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled' | 'failed';
    scheduledAt?: Date;
    sentAt?: Date;
    completedAt?: Date;
    createdBy: mongoose.Types.ObjectId;
    targetAudience: {
        interests?: string[];
        sources?: string[];
        tags?: string[];
        subscribedAfter?: Date;
        subscribedBefore?: Date;
    };
    settings: {
        trackOpens: boolean;
        trackClicks: boolean;
        trackUnsubscribes: boolean;
        fromName: string;
        fromEmail: string;
        replyToEmail?: string;
    };
    analytics: {
        openRate: number;
        clickRate: number;
        bounceRate: number;
        unsubscribeRate: number;
        complaintRate: number;
        engagementScore: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const NewsletterCampaign: mongoose.Model<INewsletterCampaign, {}, {}, {}, mongoose.Document<unknown, {}, INewsletterCampaign, {}, {}> & INewsletterCampaign & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default NewsletterCampaign;
//# sourceMappingURL=NewsletterCampaign.d.ts.map