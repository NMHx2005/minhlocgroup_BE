import mongoose, { Document } from 'mongoose';
export interface IPermission extends Document {
    name: string;
    displayName: string;
    description?: string;
    module: string;
    action: string;
    resource?: string;
    isSystem: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Permission: mongoose.Model<IPermission, {}, {}, {}, mongoose.Document<unknown, {}, IPermission, {}, {}> & IPermission & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Permission;
//# sourceMappingURL=Permission.d.ts.map