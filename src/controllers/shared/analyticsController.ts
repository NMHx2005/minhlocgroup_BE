import { Request, Response } from 'express';
import { analyticsService } from '@/services/shared/analyticsService';

/**
 * Get analytics overview
 * GET /api/v1/analytics/overview
 */
export const getAnalyticsOverview = async (req: Request, res: Response) => {
    try {
        const { period = '30d' } = req.query;
        const overview = await analyticsService.getAnalyticsOverview(period as string);

        res.json({
            success: true,
            data: overview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tổng quan analytics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get page views analytics
 * GET /api/v1/analytics/page-views
 */
export const getPageViewsAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30d', page } = req.query;
        const analytics = await analyticsService.getPageViewsAnalytics(
            period as string,
            page as string
        );

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics lượt xem trang',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get unique visitors analytics
 * GET /api/v1/analytics/unique-visitors
 */
export const getUniqueVisitorsAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService.getUniqueVisitorsAnalytics(period as string);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics khách truy cập duy nhất',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get bounce rate analytics
 * GET /api/v1/analytics/bounce-rate
 */
export const getBounceRateAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService.getBounceRateAnalytics(period as string);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics tỷ lệ thoát',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get average session duration analytics
 * GET /api/v1/analytics/session-duration
 */
export const getSessionDurationAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService.getSessionDurationAnalytics(period as string);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics thời gian phiên trung bình',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get top pages analytics
 * GET /api/v1/analytics/top-pages
 */
export const getTopPagesAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30d', limit = 10 } = req.query;
        const analytics = await analyticsService.getTopPagesAnalytics(
            period as string,
            parseInt(limit as string)
        );

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics trang phổ biến',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get traffic sources analytics
 * GET /api/v1/analytics/traffic-sources
 */
export const getTrafficSourcesAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService.getTrafficSourcesAnalytics(period as string);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics nguồn truy cập',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get device analytics
 * GET /api/v1/analytics/devices
 */
export const getDeviceAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30d' } = req.query;
        const analytics = await analyticsService.getDeviceAnalytics(period as string);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics thiết bị',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get location analytics
 * GET /api/v1/analytics/locations
 */
export const getLocationAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '30d', limit = 10 } = req.query;
        const analytics = await analyticsService.getLocationAnalytics(
            period as string,
            parseInt(limit as string)
        );

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics vị trí',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get real-time analytics
 * GET /api/v1/analytics/real-time
 */
export const getRealTimeAnalytics = async (req: Request, res: Response) => {
    try {
        const analytics = await analyticsService.getRealTimeAnalytics();

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics thời gian thực',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Track page view
 * POST /api/v1/analytics/track
 */
export const trackPageView = async (req: Request, res: Response) => {
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

        await analyticsService.trackPageView(trackingData);

        res.json({
            success: true,
            message: 'Track page view thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi track page view',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

/**
 * Get custom analytics
 * GET /api/v1/analytics/custom
 */
export const getCustomAnalytics = async (req: Request, res: Response) => {
    try {
        const { metric, period = '30d', dimensions } = req.query;
        const analytics = await analyticsService.getCustomAnalytics(
            metric as string,
            period as string,
            dimensions as string
        );

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy analytics tùy chỉnh',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
