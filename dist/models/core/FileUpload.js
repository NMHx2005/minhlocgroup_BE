"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const FileUploadSchema = new mongoose_1.Schema({
    originalName: {
        type: String,
        required: [true, 'Tên file gốc là bắt buộc'],
        trim: true,
        maxlength: [255, 'Tên file gốc không được quá 255 ký tự']
    },
    fileName: {
        type: String,
        required: [true, 'Tên file là bắt buộc'],
        trim: true,
        maxlength: [255, 'Tên file không được quá 255 ký tự']
    },
    filePath: {
        type: String,
        required: [true, 'Đường dẫn file là bắt buộc'],
        trim: true,
        maxlength: [500, 'Đường dẫn file không được quá 500 ký tự']
    },
    fileSize: {
        type: Number,
        required: [true, 'Kích thước file là bắt buộc'],
        min: [0, 'Kích thước file không được âm']
    },
    mimeType: {
        type: String,
        required: [true, 'MIME type là bắt buộc'],
        trim: true,
        maxlength: [100, 'MIME type không được quá 100 ký tự']
    },
    fileType: {
        type: String,
        required: [true, 'Loại file là bắt buộc'],
        enum: {
            values: ['image', 'document', 'video', 'audio', 'archive', 'other'],
            message: 'Loại file phải là image, document, video, audio, archive hoặc other'
        }
    },
    uploadedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người upload là bắt buộc']
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    metadata: {
        width: {
            type: Number,
            min: [0, 'Chiều rộng không được âm']
        },
        height: {
            type: Number,
            min: [0, 'Chiều cao không được âm']
        },
        duration: {
            type: Number,
            min: [0, 'Thời lượng không được âm']
        },
        pages: {
            type: Number,
            min: [0, 'Số trang không được âm']
        },
        resolution: {
            type: String,
            trim: true,
            maxlength: [50, 'Độ phân giải không được quá 50 ký tự']
        },
        bitrate: {
            type: Number,
            min: [0, 'Bitrate không được âm']
        },
        format: {
            type: String,
            trim: true,
            maxlength: [20, 'Định dạng không được quá 20 ký tự']
        }
    },
    tags: [{
            type: String,
            trim: true,
            maxlength: [50, 'Mỗi tag không được quá 50 ký tự']
        }],
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },
    altText: {
        type: String,
        trim: true,
        maxlength: [200, 'Alt text không được quá 200 ký tự']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    downloadCount: {
        type: Number,
        default: 0,
        min: [0, 'Số lần tải xuống không được âm']
    },
    lastAccessedAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
FileUploadSchema.index({ fileName: 1 });
FileUploadSchema.index({ fileType: 1 });
FileUploadSchema.index({ uploadedBy: 1 });
FileUploadSchema.index({ isPublic: 1 });
FileUploadSchema.index({ isActive: 1 });
FileUploadSchema.index({ mimeType: 1 });
FileUploadSchema.index({ tags: 1 });
FileUploadSchema.index({ createdAt: -1 });
FileUploadSchema.index({ lastAccessedAt: -1 });
FileUploadSchema.index({ fileType: 1, isActive: 1 });
FileUploadSchema.index({ uploadedBy: 1, isActive: 1 });
FileUploadSchema.index({ isPublic: 1, isActive: 1 });
FileUploadSchema.virtual('uploadedByUser', {
    ref: 'User',
    localField: 'uploadedBy',
    foreignField: '_id',
    justOne: true
});
FileUploadSchema.virtual('fileSizeDisplay').get(function () {
    const bytes = this.fileSize;
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});
FileUploadSchema.virtual('fileExtension').get(function () {
    return this.originalName.split('.').pop()?.toLowerCase() || '';
});
FileUploadSchema.virtual('fullUrl').get(function () {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${this.fileName}`;
});
FileUploadSchema.virtual('thumbnailUrl').get(function () {
    if (this.fileType !== 'image')
        return null;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/thumbnails/${this.fileName}`;
});
FileUploadSchema.virtual('dimensionsDisplay').get(function () {
    if (this.fileType === 'image' && this.metadata.width && this.metadata.height) {
        return `${this.metadata.width} x ${this.metadata.height}`;
    }
    return null;
});
FileUploadSchema.virtual('durationDisplay').get(function () {
    if (this.fileType === 'video' || this.fileType === 'audio') {
        if (this.metadata.duration) {
            const minutes = Math.floor(this.metadata.duration / 60);
            const seconds = Math.floor(this.metadata.duration % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    return null;
});
FileUploadSchema.pre('save', function (next) {
    if (this.isNew) {
        const mimeType = this.mimeType.toLowerCase();
        if (mimeType.startsWith('image/')) {
            this.fileType = 'image';
        }
        else if (mimeType.startsWith('video/')) {
            this.fileType = 'video';
        }
        else if (mimeType.startsWith('audio/')) {
            this.fileType = 'audio';
        }
        else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
            this.fileType = 'document';
        }
        else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
            this.fileType = 'archive';
        }
        else {
            this.fileType = 'other';
        }
    }
    next();
});
FileUploadSchema.statics.findByFileType = function (fileType) {
    return this.find({ fileType, isActive: true }).sort({ createdAt: -1 });
};
FileUploadSchema.statics.findByUploader = function (uploaderId) {
    return this.find({ uploadedBy: uploaderId, isActive: true }).sort({ createdAt: -1 });
};
FileUploadSchema.statics.findPublicFiles = function () {
    return this.find({ isPublic: true, isActive: true }).sort({ createdAt: -1 });
};
FileUploadSchema.statics.findByMimeType = function (mimeType) {
    return this.find({ mimeType, isActive: true }).sort({ createdAt: -1 });
};
FileUploadSchema.statics.findByTag = function (tag) {
    return this.find({ tags: tag, isActive: true }).sort({ createdAt: -1 });
};
FileUploadSchema.statics.findLargeFiles = function (minSize = 10 * 1024 * 1024) {
    return this.find({
        fileSize: { $gte: minSize },
        isActive: true
    }).sort({ fileSize: -1 });
};
FileUploadSchema.statics.findUnusedFiles = function (daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    return this.find({
        lastAccessedAt: { $lt: cutoffDate },
        isActive: true
    }).sort({ lastAccessedAt: 1 });
};
FileUploadSchema.statics.getFileStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                totalSize: { $sum: '$fileSize' },
                images: { $sum: { $cond: [{ $eq: ['$fileType', 'image'] }, 1, 0] } },
                documents: { $sum: { $cond: [{ $eq: ['$fileType', 'document'] }, 1, 0] } },
                videos: { $sum: { $cond: [{ $eq: ['$fileType', 'video'] }, 1, 0] } },
                audios: { $sum: { $cond: [{ $eq: ['$fileType', 'audio'] }, 1, 0] } },
                archives: { $sum: { $cond: [{ $eq: ['$fileType', 'archive'] }, 1, 0] } },
                others: { $sum: { $cond: [{ $eq: ['$fileType', 'other'] }, 1, 0] } },
                public: { $sum: { $cond: ['$isPublic', 1, 0] } },
                private: { $sum: { $cond: [{ $eq: ['$isPublic', false] }, 1, 0] } },
                totalDownloads: { $sum: '$downloadCount' }
            }
        }
    ]);
    const result = stats[0] || {
        total: 0,
        totalSize: 0,
        images: 0,
        documents: 0,
        videos: 0,
        audios: 0,
        archives: 0,
        others: 0,
        public: 0,
        private: 0,
        totalDownloads: 0
    };
    result.avgFileSize = result.total > 0
        ? Math.round(result.totalSize / result.total)
        : 0;
    return result;
};
FileUploadSchema.methods.incrementDownload = function () {
    this.downloadCount += 1;
    this.lastAccessedAt = new Date();
    return this.save();
};
FileUploadSchema.methods.updateMetadata = function (metadata) {
    this.metadata = { ...this.metadata, ...metadata };
    return this.save();
};
FileUploadSchema.methods.addTag = function (tag) {
    if (!this.tags.includes(tag)) {
        this.tags.push(tag);
    }
    return this.save();
};
FileUploadSchema.methods.removeTag = function (tag) {
    this.tags = this.tags.filter((t) => t !== tag);
    return this.save();
};
FileUploadSchema.methods.setPublic = function (isPublic) {
    this.isPublic = isPublic;
    return this.save();
};
const FileUpload = mongoose_1.default.model('FileUpload', FileUploadSchema);
exports.default = FileUpload;
//# sourceMappingURL=FileUpload.js.map