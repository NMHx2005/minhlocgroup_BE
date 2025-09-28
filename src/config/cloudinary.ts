import { v2 as cloudinary } from 'cloudinary';
import { appConfig } from './app';

// Configure Cloudinary
console.log('Cloudinary Config:', {
    cloudName: appConfig.cloudinary.cloudName,
    apiKey: appConfig.cloudinary.apiKey ? '***' : 'MISSING',
    apiSecret: appConfig.cloudinary.apiSecret ? '***' : 'MISSING'
});

cloudinary.config({
    cloud_name: appConfig.cloudinary.cloudName,
    api_key: appConfig.cloudinary.apiKey,
    api_secret: appConfig.cloudinary.apiSecret,
});

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

// Transformation types
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

// API Response types
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

export class CloudinaryService {
    /**
     * Merge transformations intelligently
     */
    private static mergeTransformations(
        baseTransformations: CloudinaryTransformation | CloudinaryTransformation[] = [],
        userTransformations: CloudinaryTransformation | CloudinaryTransformation[] = [],
    ): CloudinaryTransformation[] {
        const baseArray = Array.isArray(baseTransformations) ? baseTransformations : [baseTransformations];
        const userArray = Array.isArray(userTransformations) ? userTransformations : [userTransformations];

        // Merge base transformations with user transformations, user takes priority
        const merged = [...baseArray];
        userArray.forEach(userTransform => {
            // Find if there's a similar transformation in base
            const existingIndex = merged.findIndex(baseTransform =>
                this.hasSimilarTransformationType(baseTransform, userTransform)
            );

            if (existingIndex !== -1) {
                // Merge with existing transformation, user options override base
                merged[existingIndex] = { ...merged[existingIndex], ...userTransform };
            } else {
                // Add new transformation
                merged.push(userTransform);
            }
        });

        return merged;
    }

    /**
     * Check if two transformations are of similar type (both resize, both effect, etc.)
     */
    private static hasSimilarTransformationType(
        base: CloudinaryTransformation,
        user: CloudinaryTransformation,
    ): boolean {
        // Check for resize operations
        const resizeProps = ['width', 'height', 'crop'];
        const baseHasResize = resizeProps.some(prop => prop in base);
        const userHasResize = resizeProps.some(prop => prop in user);

        // Check for quality/format operations
        const formatProps = ['quality', 'format', 'fetch_format'];
        const baseHasFormat = formatProps.some(prop => prop in base);
        const userHasFormat = formatProps.some(prop => prop in user);

        // Check for effect operations
        const baseHasEffect = 'effect' in base;
        const userHasEffect = 'effect' in user;

        return (baseHasResize && userHasResize) ||
            (baseHasFormat && userHasFormat) ||
            (baseHasEffect && userHasEffect);
    }

    /**
     * Get resource type from file extension or content
     */
    private static getResourceType(options: UploadOptions, fileBuffer?: Buffer): 'image' | 'video' | 'raw' | 'auto' {
        if (options.resource_type) {
            return options.resource_type;
        }

        // Auto-detect based on format if provided
        if (options.format) {
            const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            const videoFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

            if (imageFormats.includes(options.format.toLowerCase())) {
                return 'image';
            }
            if (videoFormats.includes(options.format.toLowerCase())) {
                return 'video';
            }
            return 'raw';
        }

        return 'auto';
    }

    /**
     * Upload file to Cloudinary with intelligent transformation merging
     */
    static async uploadFile(
        fileBuffer: Buffer,
        options: UploadOptions = {},
    ): Promise<CloudinaryUploadResult> {
        return new Promise((resolve, reject) => {
            // Default transformations for optimization
            const defaultTransformations: CloudinaryTransformation[] = [
                {
                    quality: 'auto:good',
                    fetch_format: 'auto',
                },
            ];

            // Merge transformations intelligently
            const transformations = options.transformation
                ? this.mergeTransformations(defaultTransformations, options.transformation)
                : defaultTransformations;

            const uploadOptions: any = {
                resource_type: this.getResourceType(options, fileBuffer),
                folder: options.folder || 'minhloc_uploads',
                transformation: transformations,
                tags: options.tags || [],
                context: options.context,
                auto_tagging: options.auto_tagging,
                categorization: options.categorization,
                detection: options.detection,
                similarity_search: options.similarity_search,
                background_removal: options.background_removal,
                face_coordinates: options.face_coordinates,
                custom_coordinates: options.custom_coordinates,
                ...(options.public_id && { public_id: options.public_id }),
                ...options,
            };

            cloudinary.uploader
                .upload_stream(uploadOptions, (error, result) => {
                    if (error) {
                        reject(new Error(`Cloudinary upload failed: ${error.message}`));
                    } else if (result) {
                        resolve(result as CloudinaryUploadResult);
                    } else {
                        reject(new Error('Upload failed - no result received from Cloudinary'));
                    }
                })
                .end(fileBuffer);
        });
    }

    /**
     * Upload image with optimization
     */
    static async uploadImage(
        fileBuffer: Buffer,
        folder: string = 'images',
        options: UploadOptions = {},
    ): Promise<CloudinaryUploadResult> {
        const uploadOptions: UploadOptions = {
            folder: `minhloc/${folder}`,
            quality: 'auto:good',
            format: 'auto',
            transformation: [
                {
                    quality: 'auto:good',
                    fetch_format: 'auto',
                    width: options.width || 1920,
                    height: options.height,
                    crop: options.crop || 'limit',
                },
            ],
            ...options,
        };

        return this.uploadFile(fileBuffer, uploadOptions);
    }

    /**
     * Upload PDF or document
     */
    static async uploadDocument(
        fileBuffer: Buffer,
        folder: string = 'documents',
    ): Promise<CloudinaryUploadResult> {
        const uploadOptions: UploadOptions = {
            folder: `minhloc/${folder}`,
            resource_type: 'raw',
        };

        return this.uploadFile(fileBuffer, uploadOptions);
    }

    /**
     * Extract resource type from public_id or guess from URL/format
     */
    private static extractResourceType(publicId: string): 'image' | 'video' | 'raw' {
        // Check if public_id contains folder structure that indicates type
        if (publicId.includes('/documents/') || publicId.includes('/pdf/')) {
            return 'raw';
        }
        if (publicId.includes('/videos/') || publicId.includes('/video/')) {
            return 'video';
        }

        // Default to image if no clear indication
        return 'image';
    }

    /**
     * Delete file from Cloudinary with automatic resource_type detection
     */
    static async deleteFile(
        publicId: string,
        resourceType?: 'image' | 'video' | 'raw'
    ): Promise<CloudinaryDeleteResult> {
        try {
            const detectedResourceType = resourceType || this.extractResourceType(publicId);

            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: detectedResourceType,
            });

            return {
                result: result.result as 'ok' | 'not found',
                partial: result.partial,
            };
        } catch (error) {
            // If deletion fails with wrong resource type, try other types
            if (!resourceType && error instanceof Error && error.message.includes('resource not found')) {
                const resourceTypes: ('image' | 'video' | 'raw')[] = ['image', 'video', 'raw'];
                const originalType = this.extractResourceType(publicId);

                for (const type of resourceTypes) {
                    if (type !== originalType) {
                        try {
                            const result = await cloudinary.uploader.destroy(publicId, {
                                resource_type: type,
                            });
                            return {
                                result: result.result as 'ok' | 'not found',
                                partial: result.partial,
                            };
                        } catch {
                            // Continue to next type
                        }
                    }
                }
            }

            throw new Error(`Failed to delete file ${publicId}: ${error}`);
        }
    }

    /**
     * Delete multiple files from Cloudinary with resource type handling
     */
    static async deleteFiles(
        publicIds: string[],
        resourceType?: 'image' | 'video' | 'raw'
    ): Promise<CloudinaryDeleteMultipleResult> {
        try {
            // Group by resource type if not specified
            if (!resourceType) {
                const groupedIds = {
                    image: [] as string[],
                    video: [] as string[],
                    raw: [] as string[],
                };

                publicIds.forEach(id => {
                    const type = this.extractResourceType(id);
                    groupedIds[type].push(id);
                });

                // Delete each group separately
                const results: CloudinaryDeleteMultipleResult = {
                    deleted: {},
                    deleted_counts: {},
                };

                for (const [type, ids] of Object.entries(groupedIds)) {
                    if (ids.length > 0) {
                        try {
                            const result = await cloudinary.api.delete_resources(ids, {
                                resource_type: type as 'image' | 'video' | 'raw',
                            });

                            Object.assign(results.deleted, result.deleted);
                            Object.assign(results.deleted_counts, result.deleted_counts || {});
                            if (result.partial) results.partial = true;
                        } catch (error) {
                            console.warn(`Failed to delete ${type} files:`, error);
                        }
                    }
                }

                return results;
            } else {
                // Delete all with same resource type
                const result = await cloudinary.api.delete_resources(publicIds, {
                    resource_type: resourceType,
                });

                return {
                    deleted: result.deleted,
                    deleted_counts: result.deleted_counts || {},
                    partial: result.partial,
                };
            }
        } catch (error) {
            throw new Error(`Failed to delete files: ${error}`);
        }
    }

    /**
     * Delete files by folder with resource type
     */
    static async deleteFolder(
        folderPath: string,
        resourceType: 'image' | 'video' | 'raw' = 'image'
    ): Promise<CloudinaryDeleteMultipleResult> {
        try {
            const result = await cloudinary.api.delete_resources_by_prefix(folderPath, {
                resource_type: resourceType,
            });

            return {
                deleted: result.deleted,
                deleted_counts: result.deleted_counts || {},
                partial: result.partial,
            };
        } catch (error) {
            throw new Error(`Failed to delete folder ${folderPath}: ${error}`);
        }
    }

    /**
     * Get optimized URL for image
     */
    static getOptimizedUrl(
        publicId: string,
        options: {
            width?: number;
            height?: number;
            quality?: string;
            format?: string;
            crop?: string;
        } = {},
    ): string {
        return cloudinary.url(publicId, {
            quality: options.quality || 'auto:good',
            format: options.format || 'auto',
            width: options.width,
            height: options.height,
            crop: options.crop || 'limit',
            secure: true,
        });
    }

    /**
     * Create thumbnail URL
     */
    static getThumbnailUrl(
        publicId: string,
        size: number = 150,
    ): string {
        return cloudinary.url(publicId, {
            width: size,
            height: size,
            crop: 'fill',
            quality: 'auto:good',
            format: 'auto',
            secure: true,
        });
    }

    /**
     * Get file info from Cloudinary with proper resource type handling
     */
    static async getFileInfo(
        publicId: string,
        resourceType?: 'image' | 'video' | 'raw'
    ): Promise<CloudinaryResourceInfo> {
        try {
            const detectedResourceType = resourceType || this.extractResourceType(publicId);

            const result = await cloudinary.api.resource(publicId, {
                resource_type: detectedResourceType,
                colors: true,
                faces: true,
                quality_analysis: true,
                accessibility_analysis: true,
                cinemagraph_analysis: true,
            });

            return result as CloudinaryResourceInfo;
        } catch (error) {
            // If fails with wrong resource type, try other types
            if (!resourceType && error instanceof Error && error.message.includes('resource not found')) {
                const resourceTypes: ('image' | 'video' | 'raw')[] = ['image', 'video', 'raw'];
                const originalType = this.extractResourceType(publicId);

                for (const type of resourceTypes) {
                    if (type !== originalType) {
                        try {
                            const result = await cloudinary.api.resource(publicId, {
                                resource_type: type,
                                colors: true,
                                faces: true,
                                quality_analysis: true,
                            });
                            return result as CloudinaryResourceInfo;
                        } catch {
                            // Continue to next type
                        }
                    }
                }
            }

            throw new Error(`Failed to get file info for ${publicId}: ${error}`);
        }
    }

    /**
     * Get multiple files info by public_ids
     */
    static async getFilesInfo(
        publicIds: string[],
        resourceType?: 'image' | 'video' | 'raw'
    ): Promise<{ resources: CloudinaryResourceInfo[] }> {
        try {
            if (!resourceType) {
                // Group by resource type
                const groupedIds = {
                    image: [] as string[],
                    video: [] as string[],
                    raw: [] as string[],
                };

                publicIds.forEach(id => {
                    const type = this.extractResourceType(id);
                    groupedIds[type].push(id);
                });

                const allResources: CloudinaryResourceInfo[] = [];

                for (const [type, ids] of Object.entries(groupedIds)) {
                    if (ids.length > 0) {
                        try {
                            const result = await cloudinary.api.resources_by_ids(ids, {
                                resource_type: type as 'image' | 'video' | 'raw',
                                colors: true,
                                faces: true,
                                quality_analysis: true,
                            });
                            allResources.push(...(result.resources as unknown as CloudinaryResourceInfo[]));
                        } catch (error) {
                            console.warn(`Failed to get ${type} files info:`, error);
                        }
                    }
                }

                return { resources: allResources };
            } else {
                const result = await cloudinary.api.resources_by_ids(publicIds, {
                    resource_type: resourceType,
                    colors: true,
                    faces: true,
                    quality_analysis: true,
                });

                return { resources: result.resources as unknown as CloudinaryResourceInfo[] };
            }
        } catch (error) {
            throw new Error(`Failed to get files info: ${error}`);
        }
    }

    /**
     * Search resources with advanced filtering
     */
    static async searchResources(
        expression: string,
        options: {
            resourceType?: 'image' | 'video' | 'raw';
            sortBy?: 'public_id' | 'created_at' | 'uploaded_at';
            maxResults?: number;
            nextCursor?: string;
            withField?: string[];
        } = {}
    ): Promise<{
        resources: CloudinaryResourceInfo[];
        total_count: number;
        next_cursor?: string;
    }> {
        try {
            const result = await cloudinary.search
                .expression(expression)
                .sort_by(options.sortBy || 'created_at', 'desc')
                .max_results(options.maxResults || 50)
                .next_cursor(options.nextCursor || undefined)
                .with_field(options.withField || ['tags', 'context', 'metadata'])
                .execute();

            return {
                resources: result.resources as CloudinaryResourceInfo[],
                total_count: result.total_count,
                next_cursor: result.next_cursor,
            };
        } catch (error) {
            throw new Error(`Failed to search resources: ${error}`);
        }
    }
}

export default CloudinaryService;
