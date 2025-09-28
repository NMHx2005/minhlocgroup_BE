import mongoose, { Document } from 'mongoose';
export interface INewsletterSubscriber extends Document {
    email: string;
    name?: string;
    status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
    interests: string[];
    source: 'website' | 'facebook' | 'google' | 'referral' | 'other';
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    subscribedAt: Date;
    unsubscribedAt?: Date;
    lastEmailSentAt?: Date;
    totalEmailsSent: number;
    totalEmailsOpened: number;
    totalEmailsClicked: number;
    isVerified: boolean;
    verificationToken?: string;
    verificationExpiresAt?: Date;
    tags: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const NewsletterSubscriber: mongoose.Model<INewsletterSubscriber, {}, {}, {}, mongoose.Document<unknown, {}, INewsletterSubscriber, {}, {}> & INewsletterSubscriber & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default NewsletterSubscriber;
//# sourceMappingURL=NewsletterSubscriber.d.ts.map