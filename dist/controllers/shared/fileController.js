"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStats = exports.downloadFile = exports.deleteFile = exports.getFileById = exports.getFiles = exports.uploadVideo = exports.uploadDocument = exports.uploadImage = void 0;
const fileService_1 = require("@/services/shared/fileService");
const uploadImage = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
            return;
        }
        const uploadedFiles = await fileService_1.fileService.uploadImages(files, req.user?.id);
        res.json({
            success: true,
            message: 'Upload hình ảnh thành công',
            data: uploadedFiles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload hình ảnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.uploadImage = uploadImage;
const uploadDocument = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
            return;
        }
        const uploadedFiles = await fileService_1.fileService.uploadDocuments(files, req.user?.id);
        res.json({
            success: true,
            message: 'Upload tài liệu thành công',
            data: uploadedFiles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload tài liệu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.uploadDocument = uploadDocument;
const uploadVideo = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
            return;
        }
        const uploadedFiles = await fileService_1.fileService.uploadVideos(files, req.user?.id);
        res.json({
            success: true,
            message: 'Upload video thành công',
            data: uploadedFiles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload video',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.uploadVideo = uploadVideo;
const getFiles = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, userId } = req.query;
        const files = await fileService_1.fileService.getFiles(Number(page), Number(limit), {
            fileType: type
        });
        res.json({
            success: true,
            data: files
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getFiles = getFiles;
const getFileById = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await fileService_1.fileService.getFileById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getFileById = getFileById;
const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await fileService_1.fileService.deleteFile(id, req.user?.id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteFile = deleteFile;
const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await fileService_1.fileService.getFileById(id);
        if (!file) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy file'
            });
            return;
        }
        res.redirect(file.url);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.downloadFile = downloadFile;
const getFileStats = async (req, res) => {
    try {
        const stats = await fileService_1.fileService.getFileStats();
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getFileStats = getFileStats;
//# sourceMappingURL=fileController.js.map