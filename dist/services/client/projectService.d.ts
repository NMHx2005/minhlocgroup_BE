export interface ProjectFilters {
    search?: string;
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
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
export interface ProjectSearchParams {
    query?: string;
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
}
declare class ProjectService {
    getProjects(page: number, limit: number, filters: ProjectFilters): Promise<ProjectListResult>;
    getProjectById(id: string): Promise<any>;
    getProjectBySlug(slug: string): Promise<any>;
    getFeaturedProjects(limit?: number): Promise<any[]>;
    getProjectFloorPlans(projectId: string): Promise<any[]>;
    searchProjects(searchParams: ProjectSearchParams): Promise<any[]>;
    getProjectTypes(): Promise<string[]>;
}
export declare const projectService: ProjectService;
export {};
//# sourceMappingURL=projectService.d.ts.map