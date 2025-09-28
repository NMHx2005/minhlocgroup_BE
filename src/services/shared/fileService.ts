import { FileUpload } from '../../models/core';
import { v2 as cloudinary } from 'cloudinary';
import { appConfig } from '../../config/app';
import mongoose from 'mongoose';

export interface FileFilters {
    fileType?: string;
    search?: string;
}

export interface FileListResult {
    files: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

class FileService {
    // Default system user ID for uploads without specific user
    private readonly SYSTEM_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');

    constructor() {
        // Configure Cloudinary with appConfig
        cloudinary.config({
            cloud_name: appConfig.cloudinary.cloudName,
            api_key: appConfig.cloudinary.apiKey,
            api_secret: appConfig.cloudinary.apiSecret,
        });

        console.log('FileService - Cloudinary config:', {
            cloudName: appConfig.cloudinary.cloudName,
            apiKey: appConfig.cloudinary.apiKey ? 'EXISTS' : 'MISSING',
            apiSecret: appConfig.cloudinary.apiSecret ? 'EXISTS' : 'MISSING'
        });
    }

    /**
     * Upload images
     */
    async uploadImages(files: Express.Multer.File[], uploadedBy?: string): Promise<string[]> {
        try {
            const uploadPromises = files.map(file => this.uploadImage(file, uploadedBy));
            const imageUrls = await Promise.all(uploadPromises);
            return imageUrls;
        } catch (error) {
            throw new Error(`Lỗi khi upload hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Upload single image
     */
    async uploadImage(file: Express.Multer.File, uploadedBy?: string): Promise<string> {
        try {
            console.log('FileService - uploadImage called:', {
                fileName: file.originalname,
                fileSize: file.size,
                mimetype: file.mimetype,
                hasBuffer: !!file.buffer,
                hasPath: !!file.path,
                cloudinaryConfig: {
                    cloudName: appConfig.cloudinary.cloudName,
                    apiKey: appConfig.cloudinary.apiKey ? 'EXISTS' : 'MISSING',
                    apiSecret: appConfig.cloudinary.apiSecret ? 'EXISTS' : 'MISSING'
                }
            });

            // Upload to Cloudinary - handle both buffer and file path
            let uploadData: string;
            if (file.buffer) {
                // Memory storage - use buffer
                uploadData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                console.log('Using buffer data, length:', uploadData.length);
            } else if (file.path) {
                // Disk storage - use file path
                uploadData = file.path;
                console.log('Using file path:', uploadData);
            } else {
                throw new Error('No file data available');
            }

            const result = await cloudinary.uploader.upload(uploadData, {
                folder: 'minhloc/images',
                resource_type: 'image',
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            });

            // Save file metadata to database
            const fileUpload = new FileUpload({
                originalName: file.originalname,
                fileName: result.public_id,
                filePath: result.secure_url,
                fileSize: file.size,
                mimeType: file.mimetype,
                fileType: 'image',
                uploadedBy: uploadedBy ? new mongoose.Types.ObjectId(uploadedBy) : this.SYSTEM_USER_ID,
                isPublic: true,
                metadata: {
                    width: result.width,
                    height: result.height,
                    format: result.format
                }
            });

            await fileUpload.save();

            console.log('FileService - uploadImage result:', {
                originalName: file.originalname,
                secureUrl: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height
            });

            return result.secure_url;
        } catch (error) {
            throw new Error(`Lỗi khi upload hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Upload documents
     */
    async uploadDocuments(files: Express.Multer.File[], uploadedBy?: string): Promise<string[]> {
        try {
            const uploadPromises = files.map(file => this.uploadDocument(file, uploadedBy));
            const documentUrls = await Promise.all(uploadPromises);
            return documentUrls;
        } catch (error) {
            throw new Error(`Lỗi khi upload tài liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Upload single document
     */
    async uploadDocument(file: Express.Multer.File, uploadedBy?: string): Promise<string> {
        try {
            // Upload to Cloudinary - handle both buffer and file path
            let uploadData: string;
            if (file.buffer) {
                // Memory storage - use buffer
                uploadData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            } else if (file.path) {
                // Disk storage - use file path
                uploadData = file.path;
            } else {
                throw new Error('No file data available');
            }

            const result = await cloudinary.uploader.upload(uploadData, {
                folder: 'minhloc/documents',
                resource_type: 'raw'
            });

            // Save file metadata to database
            const fileUpload = new FileUpload({
                originalName: file.originalname,
                fileName: result.public_id,
                filePath: result.secure_url,
                fileSize: file.size,
                mimeType: file.mimetype,
                fileType: 'document',
                uploadedBy,
                isPublic: false,
                metadata: {
                    format: result.format
                }
            });

            await fileUpload.save();

            return result.secure_url;
        } catch (error) {
            throw new Error(`Lỗi khi upload tài liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Upload videos
     */
    async uploadVideos(files: Express.Multer.File[], uploadedBy?: string): Promise<string[]> {
        try {
            const uploadPromises = files.map(file => this.uploadVideo(file, uploadedBy));
            const videoUrls = await Promise.all(uploadPromises);
            return videoUrls;
        } catch (error) {
            throw new Error(`Lỗi khi upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Upload single video
     */
    async uploadVideo(file: Express.Multer.File, uploadedBy?: string): Promise<string> {
        try {
            // Upload to Cloudinary - handle both buffer and file path
            let uploadData: string;
            if (file.buffer) {
                // Memory storage - use buffer
                uploadData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            } else if (file.path) {
                // Disk storage - use file path
                uploadData = file.path;
            } else {
                throw new Error('No file data available');
            }

            const result = await cloudinary.uploader.upload(uploadData, {
                folder: 'minhloc/videos',
                resource_type: 'video',
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            });

            // Save file metadata to database
            const fileUpload = new FileUpload({
                originalName: file.originalname,
                fileName: result.public_id,
                filePath: result.secure_url,
                fileSize: file.size,
                mimeType: file.mimetype,
                fileType: 'video',
                uploadedBy,
                isPublic: true,
                metadata: {
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    duration: result.duration
                }
            });

            await fileUpload.save();

            return result.secure_url;
        } catch (error) {
            throw new Error(`Lỗi khi upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all uploaded files
     */
    async getFiles(page: number, limit: number, filters: FileFilters): Promise<FileListResult> {
        try {
            const query: any = {};

            // Apply filters
            if (filters.fileType) {
                query.fileType = filters.fileType;
            }

            if (filters.search) {
                query.$or = [
                    { originalName: { $regex: filters.search, $options: 'i' } },
                    { fileName: { $regex: filters.search, $options: 'i' } }
                ];
            }

            // Calculate pagination
            const skip = (page - 1) * limit;
            const total = await FileUpload.countDocuments(query);

            // Get files with pagination
            const files = await FileUpload.find(query)
                .populate('uploadedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return {
                files,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get file by ID
     */
    async getFileById(id: string): Promise<any> {
        try {
            const file = await FileUpload.findById(id)
                .populate('uploadedBy', 'name email')
                .lean();

            return file;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete file
     */
    async deleteFile(id: string, deletedBy?: string): Promise<boolean> {
        try {
            const file = await FileUpload.findById(id);
            if (!file) {
                return false;
            }

            // Delete from Cloudinary
            try {
                await cloudinary.uploader.destroy(file.fileName);
            } catch (cloudinaryError) {
                console.error('Error deleting from Cloudinary:', cloudinaryError);
                // Continue with database deletion even if Cloudinary deletion fails
            }

            // Delete from database
            const result = await FileUpload.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Lỗi khi xóa file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete file by URL
     */
    async deleteFileByUrl(fileUrl: string): Promise<boolean> {
        try {
            const file = await FileUpload.findOne({ filePath: fileUrl });
            if (!file) {
                return false;
            }

            return await this.deleteFile(file._id as string);
        } catch (error) {
            throw new Error(`Lỗi khi xóa file theo URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Download file
     */
    async downloadFile(id: string): Promise<any> {
        try {
            const file = await FileUpload.findById(id);
            if (!file) {
                return null;
            }

            // Increment download count
            await FileUpload.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

            return file;
        } catch (error) {
            throw new Error(`Lỗi khi tải file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Increment download count
     */
    async incrementDownloadCount(id: string): Promise<void> {
        try {
            await FileUpload.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
        } catch (error) {
            // Don't throw error for download count increment
            console.error('Error incrementing download count:', error);
        }
    }

    /**
     * Get file statistics
     */
    async getFileStats(): Promise<any> {
        try {
            const stats = await FileUpload.aggregate([
                {
                    $group: {
                        _id: '$fileType',
                        count: { $sum: 1 },
                        totalSize: { $sum: '$fileSize' }
                    }
                }
            ]);

            const totalFiles = await FileUpload.countDocuments();
            const totalSize = await FileUpload.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSize: { $sum: '$fileSize' }
                    }
                }
            ]);

            return {
                totalFiles,
                totalSize: totalSize[0]?.totalSize || 0,
                byType: stats
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy thống kê file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const fileService = new FileService();
