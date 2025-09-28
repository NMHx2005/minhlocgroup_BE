"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = exports.getTopPerformers = exports.getProjectProgress = exports.getRevenueChart = exports.getOverview = void 0;
const dashboardService_1 = require("@/services/admin/dashboardService");
const getOverview = async (req, res) => {
    try {
        const overview = await dashboardService_1.dashboardService.getOverview();
        res.json({
            success: true,
            data: overview
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê tổng quan',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getOverview = getOverview;
const getRevenueChart = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        const revenueData = await dashboardService_1.dashboardService.getRevenueChart(period);
        res.json({
            success: true,
            data: revenueData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu biểu đồ doanh thu',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getRevenueChart = getRevenueChart;
const getProjectProgress = async (req, res) => {
    try {
        const progressData = await dashboardService_1.dashboardService.getProjectProgress();
        res.json({
            success: true,
            data: progressData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu tiến độ dự án',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getProjectProgress = getProjectProgress;
const getTopPerformers = async (req, res) => {
    try {
        const performers = await dashboardService_1.dashboardService.getTopPerformers();
        res.json({
            success: true,
            data: performers
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu top performers',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getTopPerformers = getTopPerformers;
const getRecentActivity = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const activities = await dashboardService_1.dashboardService.getRecentActivity(Number(limit));
        res.json({
            success: true,
            data: activities
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu hoạt động gần đây',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getRecentActivity = getRecentActivity;
//# sourceMappingURL=dashboardController.js.map