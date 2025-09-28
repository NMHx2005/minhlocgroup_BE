export interface DashboardOverview {
    totalProjects: number;
    activeProjects: number;
    totalUsers: number;
    activeUsers: number;
    totalMessages: number;
    unreadMessages: number;
    totalSubscribers: number;
    activeSubscribers: number;
    totalRevenue: number;
    monthlyRevenue: number;
    projectProgress: {
        planning: number;
        construction: number;
        completed: number;
        soldOut: number;
    };
    recentActivity: any[];
}
export interface RevenueChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
    }[];
}
export interface ProjectProgressData {
    projectId: string;
    projectName: string;
    progress: number;
    status: string;
    completionDate?: Date;
}
export interface TopPerformerData {
    userId: string;
    userName: string;
    userEmail: string;
    totalProjects: number;
    totalRevenue: number;
    performance: number;
}
declare class DashboardService {
    getOverview(): Promise<DashboardOverview>;
    getRevenueChart(period: string): Promise<RevenueChartData>;
    getProjectProgress(): Promise<ProjectProgressData[]>;
    getTopPerformers(): Promise<TopPerformerData[]>;
    getRecentActivity(limit?: number): Promise<any[]>;
    private getTimeAgo;
}
export declare const dashboardService: DashboardService;
export {};
//# sourceMappingURL=dashboardService.d.ts.map