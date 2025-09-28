export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    url: string;
    width?: number;
    height?: number;
    format: string;
    resource_type: 'image' | 'video' | 'raw' | 'auto';
    bytes: number;
    created_at: string;
    original_filename?: string;
    folder?: string;
    version: number;
    etag: string;
    signature: string;
    access_mode?: 'public' | 'authenticated';
    tags?: string[];
    [key: string]: any;
}
export interface CloudinaryTransformation {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'crop' | 'pad' | 'lpad' | 'mfit' | 'mpad';
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif' | 'svg' | 'pdf';
    fetch_format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif';
    gravity?: 'center' | 'north' | 'south' | 'east' | 'west' | 'face' | 'faces' | 'auto';
    effect?: string;
    overlay?: string;
    background?: string;
    opacity?: number;
    radius?: number | string;
    border?: string;
    color?: string;
    flags?: string[];
    [key: string]: any;
}
export interface UploadOptions {
    folder?: string;
    transformation?: CloudinaryTransformation | CloudinaryTransformation[];
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif' | 'svg' | 'pdf';
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'crop' | 'pad' | 'lpad' | 'mfit' | 'mpad';
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
    public_id?: string;
    tags?: string[];
    context?: Record<string, string>;
    face_coordinates?: string;
    custom_coordinates?: string;
    auto_tagging?: number;
    categorization?: string;
    detection?: string;
    similarity_search?: boolean;
    background_removal?: 'remove' | 'screen';
    effect?: string;
    flags?: string[];
}
export interface CloudinaryDeleteResult {
    result: 'ok' | 'not found';
    partial?: boolean;
}
export interface CloudinaryDeleteMultipleResult {
    deleted: Record<string, 'deleted' | 'not_found'>;
    deleted_counts: {
        [resource_type: string]: {
            [type: string]: number;
        };
    };
    partial?: boolean;
}
export interface CloudinaryResourceInfo {
    public_id: string;
    format: string;
    version: number;
    resource_type: 'image' | 'video' | 'raw';
    type: string;
    created_at: string;
    bytes: number;
    width?: number;
    height?: number;
    url: string;
    secure_url: string;
    status?: 'complete' | 'pending';
    access_mode: 'public' | 'authenticated';
    tags: string[];
    folder?: string;
    metadata?: Record<string, any>;
    colors?: Array<[string, number]>;
    faces?: number[][];
    quality_analysis?: {
        focus: number;
        noise: number;
        contrast: number;
        brightness: number;
        sharpness: number;
        pixelation: number;
        colorfulness: number;
        lighting: number;
        color_score: number;
    };
    [key: string]: any;
}
export declare class CloudinaryService {
    private static mergeTransformations;
    private static hasSimilarTransformationType;
    private static getResourceType;
    static uploadFile(fileBuffer: Buffer, options?: UploadOptions): Promise<CloudinaryUploadResult>;
    static uploadImage(fileBuffer: Buffer, folder?: string, options?: UploadOptions): Promise<CloudinaryUploadResult>;
    static uploadDocument(fileBuffer: Buffer, folder?: string): Promise<CloudinaryUploadResult>;
    private static extractResourceType;
    static deleteFile(publicId: string, resourceType?: 'image' | 'video' | 'raw'): Promise<CloudinaryDeleteResult>;
    static deleteFiles(publicIds: string[], resourceType?: 'image' | 'video' | 'raw'): Promise<CloudinaryDeleteMultipleResult>;
    static deleteFolder(folderPath: string, resourceType?: 'image' | 'video' | 'raw'): Promise<CloudinaryDeleteMultipleResult>;
    static getOptimizedUrl(publicId: string, options?: {
        width?: number;
        height?: number;
        quality?: string;
        format?: string;
        crop?: string;
    }): string;
    static getThumbnailUrl(publicId: string, size?: number): string;
    static getFileInfo(publicId: string, resourceType?: 'image' | 'video' | 'raw'): Promise<CloudinaryResourceInfo>;
    static getFilesInfo(publicIds: string[], resourceType?: 'image' | 'video' | 'raw'): Promise<{
        resources: CloudinaryResourceInfo[];
    }>;
    static searchResources(expression: string, options?: {
        resourceType?: 'image' | 'video' | 'raw';
        sortBy?: 'public_id' | 'created_at' | 'uploaded_at';
        maxResults?: number;
        nextCursor?: string;
        withField?: string[];
    }): Promise<{
        resources: CloudinaryResourceInfo[];
        total_count: number;
        next_cursor?: string;
    }>;
}
export default CloudinaryService;
//# sourceMappingURL=cloudinary.d.ts.map