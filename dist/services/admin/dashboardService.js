"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const core_1 = require("@/models/core");
class DashboardService {
    async getOverview() {
        try {
            const totalProjects = await core_1.Project.countDocuments();
            const activeProjects = await core_1.Project.countDocuments({ isActive: true });
            const totalUsers = await core_1.User.countDocuments();
            const activeUsers = await core_1.User.countDocuments({ status: 'active' });
            const totalMessages = await core_1.ContactMessage.countDocuments();
            const unreadMessages = await core_1.ContactMessage.countDocuments({ status: 'new' });
            const totalSubscribers = await core_1.NewsletterSubscriber.countDocuments();
            const activeSubscribers = await core_1.NewsletterSubscriber.countDocuments({ status: 'active' });
            const revenueData = await core_1.Project.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: { $multiply: ['$price.min', 0.1] } }
                    }
                }
            ]);
            const monthlyRevenueData = await core_1.Project.aggregate([
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
            const projectProgress = await core_1.Project.aggregate([
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
            const recentActivity = await core_1.ContactMessage.find()
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy thống kê tổng quan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getRevenueChart(period) {
        try {
            let dateFilter = {};
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
            const revenueData = await core_1.Project.aggregate([
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
            const labels = revenueData.map(item => `${item._id.day}/${item._id.month}/${item._id.year}`);
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy dữ liệu biểu đồ doanh thu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getProjectProgress() {
        try {
            const projects = await core_1.Project.find({ isActive: true })
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
                }
                else if (project.status === 'construction') {
                    if (completion) {
                        const totalDays = Math.ceil((completion.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                        const elapsedDays = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                        progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
                    }
                    else {
                        progress = 50;
                    }
                }
                else if (project.status === 'planning') {
                    progress = 25;
                }
                return {
                    projectId: project._id.toString(),
                    projectName: project.name,
                    progress: Math.round(progress),
                    status: project.status,
                    completionDate: project.completionDate || undefined
                };
            });
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy dữ liệu tiến độ dự án: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getTopPerformers() {
        try {
            const users = await core_1.User.find({ status: 'active' })
                .select('_id name email')
                .limit(10)
                .lean();
            const performers = [];
            for (const user of users) {
                const projects = await core_1.Project.find({ createdBy: user._id })
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
            return performers
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 10);
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy dữ liệu top performers: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getRecentActivity(limit = 10) {
        try {
            const activities = await core_1.ContactMessage.find()
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
        }
        catch (error) {
            throw new Error(`Lỗi khi lấy dữ liệu hoạt động gần đây: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) {
            return `${diffInSeconds} giây trước`;
        }
        else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        }
        else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
        }
        else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
        }
    }
}
exports.dashboardService = new DashboardService();
//# sourceMappingURL=dashboardService.js.map