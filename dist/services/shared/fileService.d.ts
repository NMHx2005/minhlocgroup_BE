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
declare class FileService {
    private readonly SYSTEM_USER_ID;
    constructor();
    uploadImages(files: Express.Multer.File[], uploadedBy?: string): Promise<string[]>;
    uploadImage(file: Express.Multer.File, uploadedBy?: string): Promise<string>;
    uploadDocuments(files: Express.Multer.File[], uploadedBy?: string): Promise<string[]>;
    uploadDocument(file: Express.Multer.File, uploadedBy?: string): Promise<string>;
    uploadVideos(files: Express.Multer.File[], uploadedBy?: string): Promise<string[]>;
    uploadVideo(file: Express.Multer.File, uploadedBy?: string): Promise<string>;
    getFiles(page: number, limit: number, filters: FileFilters): Promise<FileListResult>;
    getFileById(id: string): Promise<any>;
    deleteFile(id: string, deletedBy?: string): Promise<boolean>;
    deleteFileByUrl(fileUrl: string): Promise<boolean>;
    downloadFile(id: string): Promise<any>;
    incrementDownloadCount(id: string): Promise<void>;
    getFileStats(): Promise<any>;
}
export declare const fileService: FileService;
export {};
//# sourceMappingURL=fileService.d.ts.map