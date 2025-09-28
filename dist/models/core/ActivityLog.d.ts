import mongoose, { Document } from 'mongoose';
export interface IActivityLog extends Document {
    userId?: mongoose.Types.ObjectId;
    action: string;
    resourceType: string;
    resourceId?: mongoose.Types.ObjectId;
    description: string;
    details?: any;
    ipAddress: string;
    userAgent: string;
    location?: {
        country?: string;
        region?: string;
        city?: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    sessionId?: string;
    isSuccess: boolean;
    errorMessage?: string;
    duration?: number;
    metadata?: any;
    createdAt: Date;
}
declare const ActivityLog: mongoose.Model<IActivityLog, {}, {}, {}, mongoose.Document<unknown, {}, IActivityLog, {}, {}> & IActivityLog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ActivityLog;
//# sourceMappingURL=ActivityLog.d.ts.map