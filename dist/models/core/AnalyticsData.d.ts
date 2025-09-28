import mongoose, { Document } from 'mongoose';
export interface IAnalyticsData extends Document {
    date: Date;
    metric: string;
    value: number;
    dimensions: {
        source?: string;
        medium?: string;
        campaign?: string;
        device?: string;
        browser?: string;
        os?: string;
        country?: string;
        city?: string;
        page?: string;
        userType?: string;
        [key: string]: any;
    };
    source: 'google_analytics' | 'internal' | 'facebook' | 'manual';
    category: 'traffic' | 'conversion' | 'engagement' | 'revenue' | 'user_behavior' | 'performance';
    isProcessed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const AnalyticsData: mongoose.Model<IAnalyticsData, {}, {}, {}, mongoose.Document<unknown, {}, IAnalyticsData, {}, {}> & IAnalyticsData & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default AnalyticsData;
//# sourceMappingURL=AnalyticsData.d.ts.map