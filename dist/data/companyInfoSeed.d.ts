import { Types } from 'mongoose';
export declare const companyInfoSeedData: ({
    _id: Types.ObjectId;
    section: string;
    title: string;
    content: string;
    images: string[];
    data: {
        companyName: string;
        foundedYear: number;
        headquarters: string;
        contactInfo: {
            email: string;
            phone: string;
            address: string;
            website: string;
        };
        socialMedia: {
            facebook: string;
            linkedin: string;
            youtube: string;
        };
        mission: string;
        vision: string;
        values: string[];
        achievements: {
            number: string;
            label: string;
        }[];
        milestones?: never;
        strengths?: never;
        businessAreas?: never;
        network?: never;
        partners?: never;
        activities?: never;
    };
    isActive: boolean;
    sortOrder: number;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
} | {
    _id: Types.ObjectId;
    section: string;
    title: string;
    content: string;
    images: string[];
    data: {
        milestones: {
            year: string;
            event: string;
            description: string;
        }[];
        companyName?: never;
        foundedYear?: never;
        headquarters?: never;
        contactInfo?: never;
        socialMedia?: never;
        mission?: never;
        vision?: never;
        values?: never;
        achievements?: never;
        strengths?: never;
        businessAreas?: never;
        network?: never;
        partners?: never;
        activities?: never;
    };
    isActive: boolean;
    sortOrder: number;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
} | {
    _id: Types.ObjectId;
    section: string;
    title: string;
    content: string;
    images: string[];
    data: {
        strengths: {
            title: string;
            description: string;
            icon: string;
            color: string;
        }[];
        companyName?: never;
        foundedYear?: never;
        headquarters?: never;
        contactInfo?: never;
        socialMedia?: never;
        mission?: never;
        vision?: never;
        values?: never;
        achievements?: never;
        milestones?: never;
        businessAreas?: never;
        network?: never;
        partners?: never;
        activities?: never;
    };
    isActive: boolean;
    sortOrder: number;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
} | {
    _id: Types.ObjectId;
    section: string;
    title: string;
    content: string;
    images: string[];
    data: {
        businessAreas: {
            name: string;
            description: string;
            items: string[];
            color: string;
        }[];
        network: {
            city: string;
            projects: number;
            staff: number;
        }[];
        companyName?: never;
        foundedYear?: never;
        headquarters?: never;
        contactInfo?: never;
        socialMedia?: never;
        mission?: never;
        vision?: never;
        values?: never;
        achievements?: never;
        milestones?: never;
        strengths?: never;
        partners?: never;
        activities?: never;
    };
    isActive: boolean;
    sortOrder: number;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
} | {
    _id: Types.ObjectId;
    section: string;
    title: string;
    content: string;
    images: string[];
    data: {
        partners: {
            name: string;
            type: string;
            logo: string;
        }[];
        companyName?: never;
        foundedYear?: never;
        headquarters?: never;
        contactInfo?: never;
        socialMedia?: never;
        mission?: never;
        vision?: never;
        values?: never;
        achievements?: never;
        milestones?: never;
        strengths?: never;
        businessAreas?: never;
        network?: never;
        activities?: never;
    };
    isActive: boolean;
    sortOrder: number;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
} | {
    _id: Types.ObjectId;
    section: string;
    title: string;
    content: string;
    images: string[];
    data: {
        activities: {
            title: string;
            description: string;
            image: string;
        }[];
        achievements: {
            number: string;
            label: string;
        }[];
        companyName?: never;
        foundedYear?: never;
        headquarters?: never;
        contactInfo?: never;
        socialMedia?: never;
        mission?: never;
        vision?: never;
        values?: never;
        milestones?: never;
        strengths?: never;
        businessAreas?: never;
        network?: never;
        partners?: never;
    };
    isActive: boolean;
    sortOrder: number;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
})[];
export default companyInfoSeedData;
//# sourceMappingURL=companyInfoSeed.d.ts.map