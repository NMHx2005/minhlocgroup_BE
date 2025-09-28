import { Request, Response } from 'express';
import { dashboardService } from '../../services/admin/dashboardService';

/**
 * Get dashboard overview statistics
 * GET /api/v1/dashboard/overview
 */
export const getOverview = async (req: Request, res: Response) => {
    try {
        const overview = await dashboardService.getOverview();
        res.json({
            success: true,
            data: overview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê tổng quan',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get revenue chart data
 * GET /api/v1/dashboard/revenue-chart
 */
export const getRevenueChart = async (req: Request, res: Response) => {
    try {
        const { period = '30d' } = req.query;
        const revenueData = await dashboardService.getRevenueChart(period as string);
        res.json({
            success: true,
            data: revenueData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu biểu đồ doanh thu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get project progress data
 * GET /api/v1/dashboard/project-progress
 */
export const getProjectProgress = async (req: Request, res: Response) => {
    try {
        const progressData = await dashboardService.getProjectProgress();
        res.json({
            success: true,
            data: progressData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu tiến độ dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get top performers data
 * GET /api/v1/dashboard/top-performers
 */
export const getTopPerformers = async (req: Request, res: Response) => {
    try {
        const performers = await dashboardService.getTopPerformers();
        res.json({
            success: true,
            data: performers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu top performers',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get recent activity data
 * GET /api/v1/dashboard/recent-activity
 */
export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const { limit = 10 } = req.query;
        const activities = await dashboardService.getRecentActivity(Number(limit));
        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu hoạt động gần đây',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
