"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileService = void 0;
const core_1 = require("@/models/core");
const cloudinary_1 = require("cloudinary");
const app_1 = require("@/config/app");
const mongoose_1 = __importDefault(require("mongoose"));
class FileService {
    constructor() {
        this.SYSTEM_USER_ID = new mongoose_1.default.Types.ObjectId('000000000000000000000000');
        cloudinary_1.v2.config({
            cloud_name: app_1.appConfig.cloudinary.cloudName,
            api_key: app_1.appConfig.cloudinary.apiKey,
            api_secret: app_1.appConfig.cloudinary.apiSecret,
        });
        console.log('FileService - Cloudinary config:', {
            cloudName: app_1.appConfig.cloudinary.cloudName,
            apiKey: app_1.appConfig.cloudinary.apiKey ? 'EXISTS' : 'MISSING',
            apiSecret: app_1.appConfig.cloudinary.apiSecret ? 'EXISTS' : 'MISSING'
        });
    }
    async uploadImages(files, uploadedBy) {
        try {
            const uploadPromises = files.map(file => this.uploadImage(file, uploadedBy));
            const imageUrls = await Promise.all(uploadPromises);
            return imageUrls;
        }
        catch (error) {
            throw new Error(`Lỗi khi upload hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadImage(file, uploadedBy) {
        try {
            console.log('FileService - uploadImage called:', {
                fileName: file.originalname,
                fileSize: file.size,
                mimetype: file.mimetype,
                hasBuffer: !!file.buffer,
                hasPath: !!file.path,
                cloudinaryConfig: {
                    cloudName: app_1.appConfig.cloudinary.cloudName,
                    apiKey: app_1.appConfig.cloudinary.apiKey ? 'EXISTS' : 'MISSING',
                    apiSecret: app_1.appConfig.cloudinary.apiSecret ? 'EXISTS' : 'MISSING'
                }
            });
            let uploadData;
            if (file.buffer) {
                uploadData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                console.log('Using buffer data, length:', uploadData.length);
            }
            else if (file.path) {
                uploadData = file.path;
                console.log('Using file path:', uploadData);
            }
            else {
                throw new Error('No file data available');
            }
            const result = await cloudinary_1.v2.uploader.upload(uploadData, {
                folder: 'minhloc/images',
                resource_type: 'image',
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            });
            const fileUpload = new core_1.FileUpload({
                originalName: file.originalname,
                fileName: result.public_id,
                filePath: result.secure_url,
                fileSize: file.size,
                mimeType: file.mimetype,
                fileType: 'image',
                uploadedBy: uploadedBy ? new mongoose_1.default.Types.ObjectId(uploadedBy) : this.SYSTEM_USER_ID,
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
        }
        catch (error) {
            throw new Error(`Lỗi khi upload hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadDocuments(files, uploadedBy) {
        try {
            const uploadPromises = files.map(file => this.uploadDocument(file, uploadedBy));
            const documentUrls = await Promise.all(uploadPromises);
            return documentUrls;
        }
        catch (error) {
            throw new Error(`Lỗi khi upload tài liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadDocument(file, uploadedBy) {
        try {
            let uploadData;
            if (file.buffer) {
                uploadData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            }
            else if (file.path) {
                uploadData = file.path;
            }
            else {
                throw new Error('No file data available');
            }
            const result = await cloudinary_1.v2.uploader.upload(uploadData, {
                folder: 'minhloc/documents',
                resource_type: 'raw'
            });
            const fileUpload = new core_1.FileUpload({
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
        }
        catch (error) {
            throw new Error(`Lỗi khi upload tài liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadVideos(files, uploadedBy) {
        try {
            const uploadPromises = files.map(file => this.uploadVideo(file, uploadedBy));
            const videoUrls = await Promise.all(uploadPromises);
            return videoUrls;
        }
        catch (error) {
            throw new Error(`Lỗi khi upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadVideo(file, uploadedBy) {
        try {
            let uploadData;
            if (file.buffer) {
                uploadData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            }
            else if (file.path) {
                uploadData = file.path;
            }
            else {
                throw new Error('No file data available');
            }
            const result = await cloudinary_1.v2.uploader.upload(uploadData, {
                folder: 'minhloc/videos',
                resource_type: 'video',
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            });
            const fileUpload = new core_1.FileUpload({
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
        }
        catch (error) {
            throw new Error(`Lỗi khi upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getFiles(page, limit, filters) {
        try {
            const query = {};
            if (filters.fileType) {
                query.fileType = filters.fileType;
            }
            if (filters.search) {
                query.$or = [
                    { originalName: { $regex: filters.search, $options: 'i' } },
                    { fileName: { $regex: filters.search, $options: 'i' } }
                ];
            }
            const skip = (page - 1) * limit;
            const total = await core_1.FileUpload.countDocuments(query);
            const files = await core_1.FileUpload.find(query)
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy danh sách file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getFileById(id) {
        try {
            const file = await core_1.FileUpload.findById(id)
                .populate('uploadedBy', 'name email')
                .lean();
            return file;
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thông tin file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteFile(id, deletedBy) {
        try {
            const file = await core_1.FileUpload.findById(id);
            if (!file) {
                return false;
            }
            try {
                await cloudinary_1.v2.uploader.destroy(file.fileName);
            }
            catch (cloudinaryError) {
                console.error('Error deleting from Cloudinary:', cloudinaryError);
            }
            const result = await core_1.FileUpload.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteFileByUrl(fileUrl) {
        try {
            const file = await core_1.FileUpload.findOne({ filePath: fileUrl });
            if (!file) {
                return false;
            }
            return await this.deleteFile(file._id);
        }
        catch (error) {
            throw new Error(`Lỗi khi xóa file theo URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async downloadFile(id) {
        try {
            const file = await core_1.FileUpload.findById(id);
            if (!file) {
                return null;
            }
            await core_1.FileUpload.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
            return file;
        }
        catch (error) {
            throw new Error(`Lỗi khi tải file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async incrementDownloadCount(id) {
        try {
            await core_1.FileUpload.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
        }
        catch (error) {
            console.error('Error incrementing download count:', error);
        }
    }
    async getFileStats() {
        try {
            const stats = await core_1.FileUpload.aggregate([
                {
                    $group: {
                        _id: '$fileType',
                        count: { $sum: 1 },
                        totalSize: { $sum: '$fileSize' }
                    }
                }
            ]);
            const totalFiles = await core_1.FileUpload.countDocuments();
            const totalSize = await core_1.FileUpload.aggregate([
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thống kê file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.fileService = new FileService();
