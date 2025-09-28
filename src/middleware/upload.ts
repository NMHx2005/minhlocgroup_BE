import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure multer for file uploads using memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    // Allow documents
    else if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    }
    // Allow videos
    else if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('File type not supported'));
    }
};

// Create upload middleware
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

// Specific upload configurations
export const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for images
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

export const uploadDocument = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for documents
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed'));
        }
    }
});

export const uploadVideo = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for videos
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'));
        }
    }
});