"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const app_1 = require("./app");
console.log('Cloudinary Config:', {
    cloudName: app_1.appConfig.cloudinary.cloudName,
    apiKey: app_1.appConfig.cloudinary.apiKey ? '***' : 'MISSING',
    apiSecret: app_1.appConfig.cloudinary.apiSecret ? '***' : 'MISSING'
});
cloudinary_1.v2.config({
    cloud_name: app_1.appConfig.cloudinary.cloudName,
    api_key: app_1.appConfig.cloudinary.apiKey,
    api_secret: app_1.appConfig.cloudinary.apiSecret,
});
class CloudinaryService {
    static mergeTransformations(baseTransformations = [], userTransformations = []) {
        const baseArray = Array.isArray(baseTransformations) ? baseTransformations : [baseTransformations];
        const userArray = Array.isArray(userTransformations) ? userTransformations : [userTransformations];
        const merged = [...baseArray];
        userArray.forEach(userTransform => {
            const existingIndex = merged.findIndex(baseTransform => this.hasSimilarTransformationType(baseTransform, userTransform));
            if (existingIndex !== -1) {
                merged[existingIndex] = { ...merged[existingIndex], ...userTransform };
            }
            else {
                merged.push(userTransform);
            }
        });
        return merged;
    }
    static hasSimilarTransformationType(base, user) {
        const resizeProps = ['width', 'height', 'crop'];
        const baseHasResize = resizeProps.some(prop => prop in base);
        const userHasResize = resizeProps.some(prop => prop in user);
        const formatProps = ['quality', 'format', 'fetch_format'];
        const baseHasFormat = formatProps.some(prop => prop in base);
        const userHasFormat = formatProps.some(prop => prop in user);
        const baseHasEffect = 'effect' in base;
        const userHasEffect = 'effect' in user;
        return (baseHasResize && userHasResize) ||
            (baseHasFormat && userHasFormat) ||
            (baseHasEffect && userHasEffect);
    }
    static getResourceType(options, fileBuffer) {
        if (options.resource_type) {
            return options.resource_type;
        }
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
    static async uploadFile(fileBuffer, options = {}) {
        return new Promise((resolve, reject) => {
            const defaultTransformations = [
                {
                    quality: 'auto:good',
                    fetch_format: 'auto',
                },
            ];
            const transformations = options.transformation
                ? this.mergeTransformations(defaultTransformations, options.transformation)
                : defaultTransformations;
            const uploadOptions = {
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
            cloudinary_1.v2.uploader
                .upload_stream(uploadOptions, (error, result) => {
                if (error) {
                    reject(new Error(`Cloudinary upload failed: ${error.message}`));
                }
                else if (result) {
                    resolve(result);
                }
                else {
                    reject(new Error('Upload failed - no result received from Cloudinary'));
                }
            })
                .end(fileBuffer);
        });
    }
    static async uploadImage(fileBuffer, folder = 'images', options = {}) {
        const uploadOptions = {
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
    static async uploadDocument(fileBuffer, folder = 'documents') {
        const uploadOptions = {
            folder: `minhloc/${folder}`,
            resource_type: 'raw',
        };
        return this.uploadFile(fileBuffer, uploadOptions);
    }
    static extractResourceType(publicId) {
        if (publicId.includes('/documents/') || publicId.includes('/pdf/')) {
            return 'raw';
        }
        if (publicId.includes('/videos/') || publicId.includes('/video/')) {
            return 'video';
        }
        return 'image';
    }
    static async deleteFile(publicId, resourceType) {
        try {
            const detectedResourceType = resourceType || this.extractResourceType(publicId);
            const result = await cloudinary_1.v2.uploader.destroy(publicId, {
                resource_type: detectedResourceType,
            });
            return {
                result: result.result,
                partial: result.partial,
            };
        }
        catch (error) {
            if (!resourceType && error instanceof Error && error.message.includes('resource not found')) {
                const resourceTypes = ['image', 'video', 'raw'];
                const originalType = this.extractResourceType(publicId);
                for (const type of resourceTypes) {
                    if (type !== originalType) {
                        try {
                            const result = await cloudinary_1.v2.uploader.destroy(publicId, {
                                resource_type: type,
                            });
                            return {
                                result: result.result,
                                partial: result.partial,
                            };
                        }
                        catch {
                        }
                    }
                }
            }
            throw new Error(`Failed to delete file ${publicId}: ${error}`);
        }
    }
    static async deleteFiles(publicIds, resourceType) {
        try {
            if (!resourceType) {
                const groupedIds = {
                    image: [],
                    video: [],
                    raw: [],
                };
                publicIds.forEach(id => {
                    const type = this.extractResourceType(id);
                    groupedIds[type].push(id);
                });
                const results = {
                    deleted: {},
                    deleted_counts: {},
                };
                for (const [type, ids] of Object.entries(groupedIds)) {
                    if (ids.length > 0) {
                        try {
                            const result = await cloudinary_1.v2.api.delete_resources(ids, {
                                resource_type: type,
                            });
                            Object.assign(results.deleted, result.deleted);
                            Object.assign(results.deleted_counts, result.deleted_counts || {});
                            if (result.partial)
                                results.partial = true;
                        }
                        catch (error) {
                            console.warn(`Failed to delete ${type} files:`, error);
                        }
                    }
                }
                return results;
            }
            else {
                const result = await cloudinary_1.v2.api.delete_resources(publicIds, {
                    resource_type: resourceType,
                });
                return {
                    deleted: result.deleted,
                    deleted_counts: result.deleted_counts || {},
                    partial: result.partial,
                };
            }
        }
        catch (error) {
            throw new Error(`Failed to delete files: ${error}`);
        }
    }
    static async deleteFolder(folderPath, resourceType = 'image') {
        try {
            const result = await cloudinary_1.v2.api.delete_resources_by_prefix(folderPath, {
                resource_type: resourceType,
            });
            return {
                deleted: result.deleted,
                deleted_counts: result.deleted_counts || {},
                partial: result.partial,
            };
        }
        catch (error) {
            throw new Error(`Failed to delete folder ${folderPath}: ${error}`);
        }
    }
    static getOptimizedUrl(publicId, options = {}) {
        return cloudinary_1.v2.url(publicId, {
            quality: options.quality || 'auto:good',
            format: options.format || 'auto',
            width: options.width,
            height: options.height,
            crop: options.crop || 'limit',
            secure: true,
        });
    }
    static getThumbnailUrl(publicId, size = 150) {
        return cloudinary_1.v2.url(publicId, {
            width: size,
            height: size,
            crop: 'fill',
            quality: 'auto:good',
            format: 'auto',
            secure: true,
        });
    }
    static async getFileInfo(publicId, resourceType) {
        try {
            const detectedResourceType = resourceType || this.extractResourceType(publicId);
            const result = await cloudinary_1.v2.api.resource(publicId, {
                resource_type: detectedResourceType,
                colors: true,
                faces: true,
                quality_analysis: true,
                accessibility_analysis: true,
                cinemagraph_analysis: true,
            });
            return result;
        }
        catch (error) {
            if (!resourceType && error instanceof Error && error.message.includes('resource not found')) {
                const resourceTypes = ['image', 'video', 'raw'];
                const originalType = this.extractResourceType(publicId);
                for (const type of resourceTypes) {
                    if (type !== originalType) {
                        try {
                            const result = await cloudinary_1.v2.api.resource(publicId, {
                                resource_type: type,
                                colors: true,
                                faces: true,
                                quality_analysis: true,
                            });
                            return result;
                        }
                        catch {
                        }
                    }
                }
            }
            throw new Error(`Failed to get file info for ${publicId}: ${error}`);
        }
    }
    static async getFilesInfo(publicIds, resourceType) {
        try {
            if (!resourceType) {
                const groupedIds = {
                    image: [],
                    video: [],
                    raw: [],
                };
                publicIds.forEach(id => {
                    const type = this.extractResourceType(id);
                    groupedIds[type].push(id);
                });
                const allResources = [];
                for (const [type, ids] of Object.entries(groupedIds)) {
                    if (ids.length > 0) {
                        try {
                            const result = await cloudinary_1.v2.api.resources_by_ids(ids, {
                                resource_type: type,
                                colors: true,
                                faces: true,
                                quality_analysis: true,
                            });
                            allResources.push(...result.resources);
                        }
                        catch (error) {
                            console.warn(`Failed to get ${type} files info:`, error);
                        }
                    }
                }
                return { resources: allResources };
            }
            else {
                const result = await cloudinary_1.v2.api.resources_by_ids(publicIds, {
                    resource_type: resourceType,
                    colors: true,
                    faces: true,
                    quality_analysis: true,
                });
                return { resources: result.resources };
            }
        }
        catch (error) {
            throw new Error(`Failed to get files info: ${error}`);
        }
    }
    static async searchResources(expression, options = {}) {
        try {
            const result = await cloudinary_1.v2.search
                .expression(expression)
                .sort_by(options.sortBy || 'created_at', 'desc')
                .max_results(options.maxResults || 50)
                .next_cursor(options.nextCursor || undefined)
                .with_field(options.withField || ['tags', 'context', 'metadata'])
                .execute();
            return {
                resources: result.resources,
                total_count: result.total_count,
                next_cursor: result.next_cursor,
            };
        }
        catch (error) {
            throw new Error(`Failed to search resources: ${error}`);
        }
    }
}
exports.CloudinaryService = CloudinaryService;
exports.default = CloudinaryService;
