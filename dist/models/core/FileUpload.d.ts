import mongoose, { Document } from 'mongoose';
export interface IFileUpload extends Document {
    originalName: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileType: 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';
    uploadedBy: mongoose.Types.ObjectId;
    isPublic: boolean;
    metadata: {
        width?: number;
        height?: number;
        duration?: number;
        pages?: number;
        resolution?: string;
        bitrate?: number;
        format?: string;
        [key: string]: any;
    };
    tags: string[];
    description?: string;
    altText?: string;
    isActive: boolean;
    downloadCount: number;
    lastAccessedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const FileUpload: mongoose.Model<IFileUpload, {}, {}, {}, mongoose.Document<unknown, {}, IFileUpload, {}, {}> & IFileUpload & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default FileUpload;
//# sourceMappingURL=FileUpload.d.ts.map