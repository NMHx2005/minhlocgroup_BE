import mongoose, { Document } from 'mongoose';
export interface ISystemSetting extends Document {
    key: string;
    value: any;
    type: 'text' | 'number' | 'boolean' | 'json' | 'file' | 'url' | 'email';
    group: 'general' | 'api' | 'email' | 'social' | 'seo' | 'security' | 'payment' | 'notification';
    description?: string;
    isPublic: boolean;
    isRequired: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        options?: string[];
    };
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const SystemSetting: mongoose.Model<ISystemSetting, {}, {}, {}, mongoose.Document<unknown, {}, ISystemSetting, {}, {}> & ISystemSetting & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default SystemSetting;
//# sourceMappingURL=SystemSetting.d.ts.map