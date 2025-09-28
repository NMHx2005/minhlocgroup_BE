export interface ProjectFilters {
    search?: string;
    type?: string;
    status?: string;
    location?: string;
    city?: string;
    district?: string;
}
export interface ProjectListResult {
    projects: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
declare class ProjectService {
    getProjects(page: number, limit: number, filters: ProjectFilters): Promise<ProjectListResult>;
    getProjectById(id: string): Promise<any>;
    createProject(projectData: any): Promise<any>;
    updateProject(id: string, updateData: any): Promise<any>;
    deleteProject(id: string): Promise<boolean>;
    uploadGalleryImages(projectId: string, files: Express.Multer.File[]): Promise<string[]>;
    deleteGalleryImage(projectId: string, imageUrl: string): Promise<void>;
    addGalleryImageUrl(projectId: string, imageUrl: string): Promise<string[]>;
    getProjectTypes(): Promise<string[]>;
    getProjectFloorPlans(projectId: string): Promise<any[]>;
    createFloorPlan(projectId: string, floorPlanData: any): Promise<any>;
    updateFloorPlan(floorPlanId: string, updateData: any): Promise<any>;
    deleteFloorPlan(floorPlanId: string): Promise<boolean>;
}
export declare const projectService: ProjectService;
export {};
//# sourceMappingURL=projectService.d.ts.map