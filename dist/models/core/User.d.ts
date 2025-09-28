import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    company?: string;
    type: 'individual' | 'business';
    status: 'active' | 'inactive' | 'blocked';
    role: 'admin' | 'editor' | 'viewer' | 'customer';
    roles?: mongoose.Types.ObjectId[];
    permissions?: string[];
    avatar?: string;
    notes?: string;
    interests?: string[];
    totalOrders: number;
    totalSpent: number;
    lastActivity: Date;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    toJSON(): any;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map