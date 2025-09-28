import mongoose, { Document } from 'mongoose';
export interface IRole extends Document {
    name: string;
    displayName: string;
    description?: string;
    permissions: string[];
    isSystem: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Role: mongoose.Model<IRole, {}, {}, {}, mongoose.Document<unknown, {}, IRole, {}, {}> & IRole & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Role;
//# sourceMappingURL=Role.d.ts.map