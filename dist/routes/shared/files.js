"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileController_1 = require("@/controllers/shared/fileController");
const auth_1 = require("@/middleware/auth");
const upload_1 = require("@/middleware/upload");
const router = (0, express_1.Router)();
router.post('/images', auth_1.authMiddleware, upload_1.upload.array('images', 10), fileController_1.uploadImage);
router.post('/documents', auth_1.authMiddleware, upload_1.upload.array('documents', 5), fileController_1.uploadDocument);
router.post('/videos', auth_1.authMiddleware, upload_1.upload.array('videos', 3), fileController_1.uploadVideo);
router.get('/', auth_1.authMiddleware, fileController_1.getFiles);
router.get('/stats', auth_1.authMiddleware, fileController_1.getFileStats);
router.get('/:id', auth_1.authMiddleware, fileController_1.getFileById);
router.delete('/:id', auth_1.authMiddleware, fileController_1.deleteFile);
router.get('/:id/download', auth_1.authMiddleware, fileController_1.downloadFile);
exports.default = router;
//# sourceMappingURL=files.js.map