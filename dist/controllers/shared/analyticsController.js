"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomAnalytics = exports.trackPageView = exports.getRealTimeAnalytics = exports.getLocationAnalytics = exports.getDeviceAnalytics = exports.getTrafficSourcesAnalytics = exports.getTopPagesAnalytics = exports.getSessionDurationAnalytics = exports.getBounceRateAnalytics = exports.getUniqueVisitorsAnalytics = exports.getPageViewsAnalytics = exports.getAnalyticsOverview = void 0;
const analyticsService_1 = require("@/services/shared/analyticsService");
const getAnalyticsOverview = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        const overview = await analyticsService_1.analyticsService.getAnalyticsOverview(period);
        res.json({
            success: true,
            data: overview
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tổng quan analytics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getAnalyticsOverview = getAnalyticsOverview;
const getPageViewsAnalytics = async (req, res) => {
    try {
        const { period = '30d', page } = req.query;
        const analytics = await analyticsService_1.analyticsService.getPageViewsAnalytics(period, page);
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics lượt xem trang',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getPageViewsAnalytics = getPageViewsAnalytics;
const getUniqueVisitorsAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService_1.analyticsService.getUniqueVisitorsAnalytics(period);
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics khách truy cập duy nhất',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getUniqueVisitorsAnalytics = getUniqueVisitorsAnalytics;
const getBounceRateAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService_1.analyticsService.getBounceRateAnalytics(period);
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics tỷ lệ thoát',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getBounceRateAnalytics = getBounceRateAnalytics;
const getSessionDurationAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService_1.analyticsService.getSessionDurationAnalytics(period);
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics thời gian phiên trung bình',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getSessionDurationAnalytics = getSessionDurationAnalytics;
const getTopPagesAnalytics = async (req, res) => {
    try {
        const { period = '30d', limit = 10 } = req.query;
        const analytics = await analyticsService_1.analyticsService.getTopPagesAnalytics(period, parseInt(limit));
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics trang phổ biến',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getTopPagesAnalytics = getTopPagesAnalytics;
const getTrafficSourcesAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService_1.analyticsService.getTrafficSourcesAnalytics(period);
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics nguồn truy cập',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getTrafficSourcesAnalytics = getTrafficSourcesAnalytics;
const getDeviceAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService_1.analyticsService.getDeviceAnalytics(period);
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics thiết bị',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getDeviceAnalytics = getDeviceAnalytics;
const getLocationAnalytics = async (req, res) => {
    try {
        const { period = '30d', limit = 10 } = req.query;
        const analytics = await analyticsService_1.analyticsService.getLocationAnalytics(period, parseInt(limit));
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics vị trí',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getLocationAnalytics = getLocationAnalytics;
const getRealTimeAnalytics = async (req, res) => {
    try {
        const analytics = await analyticsService_1.analyticsService.getRealTimeAnalytics();
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics thời gian thực',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getRealTimeAnalytics = getRealTimeAnalytics;
const trackPageView = async (req, res) => {
    try {
        const { page, title, referrer } = req.body;
        const trackingData = {
            page,
            title,
            referrer,
            ipAddress: req.ip || '',
            userAgent: req.get('User-Agent') || '',
            timestamp: new Date()
        };
        await analyticsService_1.analyticsService.trackPageView(trackingData);
        res.json({
            success: true,
            message: 'Track page view thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi track page view',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.trackPageView = trackPageView;
const getCustomAnalytics = async (req, res) => {
    try {
        const { metric, period = '30d', dimensions } = req.query;
        const analytics = await analyticsService_1.analyticsService.getCustomAnalytics(metric, period, dimensions);
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics tùy chỉnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getCustomAnalytics = getCustomAnalytics;
