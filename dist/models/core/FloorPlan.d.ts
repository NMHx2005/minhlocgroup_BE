import mongoose, { Document } from 'mongoose';
export interface IFloorPlan extends Document {
    projectId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    price: number;
    image: string;
    floorPlanImage: string;
    dimensions: {
        length: number;
        width: number;
        unit: string;
    };
    features: string[];
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const FloorPlan: mongoose.Model<IFloorPlan, {}, {}, {}, mongoose.Document<unknown, {}, IFloorPlan, {}, {}> & IFloorPlan & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default FloorPlan;
//# sourceMappingURL=FloorPlan.d.ts.map