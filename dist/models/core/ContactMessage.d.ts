import mongoose, { Document } from 'mongoose';
export interface IContactMessage extends Document {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: mongoose.Types.ObjectId;
    reply?: {
        message: string;
        repliedBy: mongoose.Types.ObjectId;
        repliedAt: Date;
    };
    source: 'website' | 'email' | 'phone' | 'social' | 'other';
    ipAddress?: string;
    userAgent?: string;
    attachments?: string[];
    tags: string[];
    notes: string;
    followUpDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const ContactMessage: mongoose.Model<IContactMessage, {}, {}, {}, mongoose.Document<unknown, {}, IContactMessage, {}, {}> & IContactMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ContactMessage;
//# sourceMappingURL=ContactMessage.d.ts.map