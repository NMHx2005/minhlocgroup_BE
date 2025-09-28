import { Project, User, ContactMessage, NewsletterSubscriber, AnalyticsData } from '@/models/core';

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

class DashboardService {
    /**
     * Get dashboard overview statistics
     */
    async getOverview(): Promise<DashboardOverview> {
        try {
            // Get project statistics
            const totalProjects = await Project.countDocuments();
            const activeProjects = await Project.countDocuments({ isActive: true });

            // Get user statistics
            const totalUsers = await User.countDocuments();
            const activeUsers = await User.countDocuments({ status: 'active' });

            // Get message statistics
            const totalMessages = await ContactMessage.countDocuments();
            const unreadMessages = await ContactMessage.countDocuments({ status: 'new' });

            // Get subscriber statistics
            const totalSubscribers = await NewsletterSubscriber.countDocuments();
            const activeSubscribers = await NewsletterSubscriber.countDocuments({ status: 'active' });

            // Get revenue statistics (using price fields instead of revenue)
            const revenueData = await Project.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: { $multiply: ['$price.min', 0.1] } } // Estimate 10% of min price as revenue
                    }
                }
            ]);

            const monthlyRevenueData = await Project.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        monthlyRevenue: { $sum: { $multiply: ['$price.min', 0.1] } }
                    }
                }
            ]);

            // Get project progress statistics
            const projectProgress = await Project.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const progressStats = {
                planning: 0,
                construction: 0,
                completed: 0,
                soldOut: 0
            };

            projectProgress.forEach(stat => {
                switch (stat._id) {
                    case 'planning':
                        progressStats.planning = stat.count;
                        break;
                    case 'construction':
                        progressStats.construction = stat.count;
                        break;
                    case 'completed':
                        progressStats.completed = stat.count;
                        break;
                    case 'sold_out':
                        progressStats.soldOut = stat.count;
                        break;
                }
            });

            // Get recent activity (last 10 activities)
            const recentActivity = await ContactMessage.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('name email subject status createdAt')
                .lean();

            return {
                totalProjects,
                activeProjects,
                totalUsers,
                activeUsers,
                totalMessages,
                unreadMessages,
                totalSubscribers,
                activeSubscribers,
                totalRevenue: revenueData[0]?.totalRevenue || 0,
                monthlyRevenue: monthlyRevenueData[0]?.monthlyRevenue || 0,
                projectProgress: progressStats,
                recentActivity
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy thống kê tổng quan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get revenue chart data
     */
    async getRevenueChart(period: string): Promise<RevenueChartData> {
        try {
            let dateFilter: any = {};
            const now = new Date();

            switch (period) {
                case '7d':
                    dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
                    break;
                case '30d':
                    dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
                    break;
                case '90d':
                    dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
                    break;
                case '1y':
                    dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
                    break;
                default:
                    dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
            }

            const revenueData = await Project.aggregate([
                {
                    $match: {
                        createdAt: dateFilter
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            day: { $dayOfMonth: '$createdAt' }
                        },
                        revenue: { $sum: { $multiply: ['$price.min', 0.1] } }
                    }
                },
                {
                    $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
                }
            ]);

            const labels = revenueData.map(item =>
                `${item._id.day}/${item._id.month}/${item._id.year}`
            );
            const data = revenueData.map(item => item.revenue);

            return {
                labels,
                datasets: [{
                    label: 'Doanh thu',
                    data,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }]
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy dữ liệu biểu đồ doanh thu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get project progress data
     */
    async getProjectProgress(): Promise<ProjectProgressData[]> {
        try {
            const projects = await Project.find({ isActive: true })
                .select('name status completionDate createdAt')
                .sort({ createdAt: -1 })
                .limit(20)
                .lean();

            return projects.map(project => {
                let progress = 0;
                const now = new Date();
                const created = new Date(project.createdAt);
                const completion = project.completionDate ? new Date(project.completionDate) : null;

                if (project.status === 'completed') {
                    progress = 100;
                } else if (project.status === 'construction') {
                    if (completion) {
                        const totalDays = Math.ceil((completion.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                        const elapsedDays = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                        progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
                    } else {
                        progress = 50; // Default progress for construction without completion date
                    }
                } else if (project.status === 'planning') {
                    progress = 25;
                }

                return {
                    projectId: project._id.toString(),
                    projectName: project.name,
                    progress: Math.round(progress),
                    status: project.status,
                    completionDate: project.completionDate || undefined
                } as ProjectProgressData;
            });
        } catch (error) {
            throw new Error(`Lỗi khi lấy dữ liệu tiến độ dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get top performers data
     */
    async getTopPerformers(): Promise<TopPerformerData[]> {
        try {
            // First, let's get all users and their projects separately to avoid complex aggregation
            const users = await User.find({ status: 'active' })
                .select('_id name email')
                .limit(10)
                .lean();

            const performers: TopPerformerData[] = [];

            for (const user of users) {
                const projects = await Project.find({ createdBy: user._id })
                    .select('price')
                    .lean();

                const totalProjects = projects.length;
                const totalRevenue = projects.reduce((sum, project) => {
                    return sum + (project.price?.min || 0) * 0.1;
                }, 0);

                const performance = (totalProjects + totalRevenue / 1000000) * 10;

                performers.push({
                    userId: user._id.toString(),
                    userName: user.name || 'Unknown',
                    userEmail: user.email || '',
                    totalProjects,
                    totalRevenue: Math.round(totalRevenue),
                    performance: Math.round(performance * 100) / 100
                });
            }

            // Sort by performance and return top 10
            return performers
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 10);
        } catch (error) {
            throw new Error(`Lỗi khi lấy dữ liệu top performers: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get recent activity data
     */
    async getRecentActivity(limit: number = 10): Promise<any[]> {
        try {
            const activities = await ContactMessage.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('name email subject status createdAt')
                .lean();

            return activities.map(activity => ({
                id: activity._id,
                type: 'message',
                title: `Tin nhắn mới từ ${activity.name}`,
                description: activity.subject || 'Không có tiêu đề',
                status: activity.status,
                createdAt: activity.createdAt,
                timeAgo: this.getTimeAgo(activity.createdAt)
            }));
        } catch (error) {
            throw new Error(`Lỗi khi lấy dữ liệu hoạt động gần đây: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Helper method to calculate time ago
     */
    private getTimeAgo(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} giây trước`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
        }
    }
}

export const dashboardService = new DashboardService();
