import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { fileService } from '../../services/shared/fileService';

/**
 * Upload image
 * POST /api/v1/uploads/images
 */
export const uploadImage = async (req: AuthRequest, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
            return;
        }

        const uploadedFiles = await fileService.uploadImages(files, req.user?.id);

        res.json({
            success: true,
            message: 'Upload hình ảnh thành công',
            data: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload hình ảnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Upload document
 * POST /api/v1/uploads/documents
 */
export const uploadDocument = async (req: AuthRequest, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
            return;
        }

        const uploadedFiles = await fileService.uploadDocuments(files, req.user?.id);

        res.json({
            success: true,
            message: 'Upload tài liệu thành công',
            data: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload tài liệu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Upload video
 * POST /api/v1/uploads/videos
 */
export const uploadVideo = async (req: AuthRequest, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
            return;
        }

        const uploadedFiles = await fileService.uploadVideos(files, req.user?.id);

        res.json({
            success: true,
            message: 'Upload video thành công',
            data: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload video',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get all files
 * GET /api/v1/uploads
 */
export const getFiles = async (req: AuthRequest, res: Response) => {
    try {
        const { page = 1, limit = 10, type, userId } = req.query;

        const files = await fileService.getFiles(Number(page), Number(limit), {
            fileType: type as string
        });

        res.json({
            success: true,
            data: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get file by ID
 * GET /api/v1/uploads/:id
 */
export const getFileById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const file = await fileService.getFileById(id as string);

        if (!file) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy file'
            });
            return;
        }

        res.json({
            success: true,
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Delete file
 * DELETE /api/v1/uploads/:id
 */
export const deleteFile = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = await fileService.deleteFile(id as string, req.user?.id);

        if (!result) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy file hoặc không có quyền xóa'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Xóa file thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Download file
 * GET /api/v1/uploads/:id/download
 */
export const downloadFile = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const file = await fileService.getFileById(id as string);

        if (!file) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy file'
            });
            return;
        }

        // Redirect to Cloudinary URL for download
        res.redirect(file.url);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get file statistics
 * GET /api/v1/uploads/stats
 */
export const getFileStats = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await fileService.getFileStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};