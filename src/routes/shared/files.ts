import { Router } from 'express';
import {
    uploadImage,
    uploadDocument,
    uploadVideo,
    getFiles,
    getFileById,
    deleteFile,
    downloadFile,
    getFileStats
} from '../../controllers/shared/fileController';
import { authMiddleware } from '../../middleware/auth';
import { upload } from '../../middleware/upload';

const router = Router();

// File upload routes (require authentication)
router.post('/images', authMiddleware, upload.array('images', 10), uploadImage);
router.post('/documents', authMiddleware, upload.array('documents', 5), uploadDocument);
router.post('/videos', authMiddleware, upload.array('videos', 3), uploadVideo);

// File management routes (require authentication)
router.get('/', authMiddleware, getFiles);
router.get('/stats', authMiddleware, getFileStats);
router.get('/:id', authMiddleware, getFileById);
router.delete('/:id', authMiddleware, deleteFile);
router.get('/:id/download', authMiddleware, downloadFile);

export default router;
