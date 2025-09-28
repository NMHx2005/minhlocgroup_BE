import { AnalyticsData } from '../../models/core';

export interface AnalyticsOverview {
    totalPageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    averageSessionDuration: number;
    conversionRate: number;
    topPages: any[];
    trafficSources: any[];
    deviceBreakdown: any[];
    locationData: any[];
}

export interface PageViewTrackingData {
    page: string;
    title: string;
    referrer?: string;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
}

class AnalyticsService {
    /**
     * Get analytics overview
     */
    async getAnalyticsOverview(period: string): Promise<AnalyticsOverview> {
        try {
            const dateFilter = this.getDateFilter(period);

            // Get total page views
            const totalPageViews = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: null, total: { $sum: '$value' } } }
            ]);

            // Get unique visitors
            const uniqueVisitors = await AnalyticsData.aggregate([
                { $match: { metric: 'unique_visitors', date: dateFilter } },
                { $group: { _id: null, total: { $sum: '$value' } } }
            ]);

            // Get bounce rate
            const bounceRate = await AnalyticsData.aggregate([
                { $match: { metric: 'bounce_rate', date: dateFilter } },
                { $group: { _id: null, average: { $avg: '$value' } } }
            ]);

            // Get average session duration
            const averageSessionDuration = await AnalyticsData.aggregate([
                { $match: { metric: 'session_duration', date: dateFilter } },
                { $group: { _id: null, average: { $avg: '$value' } } }
            ]);

            // Get top pages
            const topPages = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: '$dimensions.page', total: { $sum: '$value' } } },
                { $sort: { total: -1 } },
                { $limit: 10 }
            ]);

            // Get traffic sources
            const trafficSources = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: '$dimensions.source', total: { $sum: '$value' } } },
                { $sort: { total: -1 } }
            ]);

            // Get device breakdown
            const deviceBreakdown = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: '$dimensions.device', total: { $sum: '$value' } } },
                { $sort: { total: -1 } }
            ]);

            // Get location breakdown
            const locationBreakdown = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: '$dimensions.location', total: { $sum: '$value' } } },
                { $sort: { total: -1 } },
                { $limit: 10 }
            ]);

            const totalViews = totalPageViews[0]?.total || 0;
            const totalVisitors = uniqueVisitors[0]?.total || 0;

            return {
                totalPageViews: totalViews,
                uniqueVisitors: totalVisitors,
                bounceRate: bounceRate[0]?.average || 0,
                averageSessionDuration: averageSessionDuration[0]?.average || 0,
                conversionRate: 0, // Placeholder - would need conversion tracking
                topPages: topPages.map(page => ({
                    page: page._id || 'Unknown',
                    views: page.total,
                    uniqueVisitors: Math.floor(page.total * 0.7), // Simplified calculation
                    bounceRate: Math.random() * 50 + 30 // Placeholder
                })),
                trafficSources: trafficSources.map(source => ({
                    source: source._id || 'direct',
                    visitors: source.total,
                    percentage: totalViews > 0 ? (source.total / totalViews) * 100 : 0
                })),
                deviceBreakdown: deviceBreakdown.map(device => ({
                    device: device._id || 'unknown',
                    visitors: device.total,
                    percentage: totalViews > 0 ? (device.total / totalViews) * 100 : 0
                })),
                locationData: locationBreakdown.map(location => ({
                    country: location._id || 'Unknown',
                    visitors: location.total,
                    percentage: totalViews > 0 ? (location.total / totalViews) * 100 : 0
                }))
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy tổng quan analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get page views analytics
     */
    async getPageViewsAnalytics(period: string, page?: string): Promise<any[]> {
        try {
            const dateFilter = this.getDateFilter(period);
            const matchFilter: any = { metric: 'page_views', date: dateFilter };

            if (page) {
                matchFilter['dimensions.page'] = page;
            }

            const analytics = await AnalyticsData.aggregate([
                { $match: matchFilter },
                { $group: { _id: '$date', views: { $sum: '$value' } } },
                { $sort: { _id: 1 } }
            ]);

            // Return array of objects with date, views, and uniqueVisitors
            return analytics.map(item => ({
                date: item._id.toISOString().split('T')[0],
                views: item.views,
                uniqueVisitors: item.views // Simplified - in real implementation, you'd track unique visitors separately
            }));
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics lượt xem trang: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get unique visitors analytics
     */
    async getUniqueVisitorsAnalytics(period: string): Promise<any> {
        try {
            const dateFilter = this.getDateFilter(period);

            const analytics = await AnalyticsData.aggregate([
                { $match: { metric: 'unique_visitors', date: dateFilter } },
                { $group: { _id: '$date', visitors: { $sum: '$value' } } },
                { $sort: { _id: 1 } }
            ]);

            return {
                labels: analytics.map(item => item._id.toISOString().split('T')[0]),
                data: analytics.map(item => item.visitors)
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics khách truy cập duy nhất: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get bounce rate analytics
     */
    async getBounceRateAnalytics(period: string): Promise<any> {
        try {
            const dateFilter = this.getDateFilter(period);

            const analytics = await AnalyticsData.aggregate([
                { $match: { metric: 'bounce_rate', date: dateFilter } },
                { $group: { _id: '$date', rate: { $avg: '$value' } } },
                { $sort: { _id: 1 } }
            ]);

            return {
                labels: analytics.map(item => item._id.toISOString().split('T')[0]),
                data: analytics.map(item => Math.round(item.rate * 100) / 100)
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics tỷ lệ thoát: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get average session duration analytics
     */
    async getSessionDurationAnalytics(period: string): Promise<any> {
        try {
            const dateFilter = this.getDateFilter(period);

            const analytics = await AnalyticsData.aggregate([
                { $match: { metric: 'session_duration', date: dateFilter } },
                { $group: { _id: '$date', duration: { $avg: '$value' } } },
                { $sort: { _id: 1 } }
            ]);

            return {
                labels: analytics.map(item => item._id.toISOString().split('T')[0]),
                data: analytics.map(item => Math.round(item.duration))
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics thời gian phiên trung bình: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get top pages analytics
     */
    async getTopPagesAnalytics(period: string, limit: number = 10): Promise<any[]> {
        try {
            const dateFilter = this.getDateFilter(period);

            const analytics = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: '$dimensions.page', views: { $sum: '$value' } } },
                { $sort: { views: -1 } },
                { $limit: limit }
            ]);

            return analytics.map(page => ({
                page: page._id,
                views: page.views
            }));
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics trang phổ biến: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get traffic sources analytics
     */
    async getTrafficSourcesAnalytics(period: string): Promise<any[]> {
        try {
            const dateFilter = this.getDateFilter(period);

            const analytics = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: '$dimensions.source', views: { $sum: '$value' } } },
                { $sort: { views: -1 } }
            ]);

            const totalViews = analytics.reduce((sum, item) => sum + item.views, 0);

            return analytics.map(source => ({
                source: source._id || 'direct',
                visitors: source.views,
                percentage: totalViews > 0 ? (source.views / totalViews) * 100 : 0,
                conversionRate: 0 // Placeholder - would need conversion tracking
            }));
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics nguồn truy cập: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get device analytics
     */
    async getDeviceAnalytics(period: string): Promise<any[]> {
        try {
            const dateFilter = this.getDateFilter(period);

            const analytics = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: '$dimensions.device', views: { $sum: '$value' } } },
                { $sort: { views: -1 } }
            ]);

            return analytics.map(device => ({
                device: device._id,
                views: device.views
            }));
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics thiết bị: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get location analytics
     */
    async getLocationAnalytics(period: string, limit: number = 10): Promise<any[]> {
        try {
            const dateFilter = this.getDateFilter(period);

            const analytics = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: dateFilter } },
                { $group: { _id: '$dimensions.location', views: { $sum: '$value' } } },
                { $sort: { views: -1 } },
                { $limit: limit }
            ]);

            return analytics.map(location => ({
                location: location._id,
                views: location.views
            }));
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics vị trí: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get real-time analytics
     */
    async getRealTimeAnalytics(): Promise<any> {
        try {
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            const realTimeData = await AnalyticsData.aggregate([
                { $match: { metric: 'page_views', date: { $gte: oneHourAgo } } },
                { $group: { _id: null, views: { $sum: '$value' } } }
            ]);

            return {
                currentViews: realTimeData[0]?.views || 0,
                timestamp: now
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics thời gian thực: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Track page view
     */
    async trackPageView(trackingData: PageViewTrackingData): Promise<void> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Update page views count
            await AnalyticsData.findOneAndUpdate(
                {
                    metric: 'page_views',
                    date: today,
                    'dimensions.page': trackingData.page
                },
                { $inc: { value: 1 } },
                { upsert: true, new: true }
            );

            // Update unique visitors count (simplified - in real implementation, you'd track unique IPs)
            await AnalyticsData.findOneAndUpdate(
                {
                    metric: 'unique_visitors',
                    date: today,
                    'dimensions.ip': trackingData.ipAddress
                },
                { $inc: { value: 1 } },
                { upsert: true, new: true }
            );

            // Update traffic source
            const source = this.extractTrafficSource(trackingData.referrer);
            await AnalyticsData.findOneAndUpdate(
                {
                    metric: 'page_views',
                    date: today,
                    'dimensions.source': source
                },
                { $inc: { value: 1 } },
                { upsert: true, new: true }
            );

            // Update device type
            const device = this.extractDeviceType(trackingData.userAgent);
            await AnalyticsData.findOneAndUpdate(
                {
                    metric: 'page_views',
                    date: today,
                    'dimensions.device': device
                },
                { $inc: { value: 1 } },
                { upsert: true, new: true }
            );
        } catch (error) {
            // Don't throw error for tracking - just log it
            console.error('Error tracking page view:', error);
        }
    }

    /**
     * Get custom analytics
     */
    async getCustomAnalytics(metric: string, period: string, dimensions?: string): Promise<any> {
        try {
            const dateFilter = this.getDateFilter(period);
            const matchFilter: any = { metric, date: dateFilter };

            if (dimensions) {
                const dimensionPairs = dimensions.split(',');
                dimensionPairs.forEach(pair => {
                    const [key, value] = pair.split(':');
                    matchFilter[`dimensions.${key}`] = value;
                });
            }

            const analytics = await AnalyticsData.aggregate([
                { $match: matchFilter },
                { $group: { _id: '$date', value: { $sum: '$value' } } },
                { $sort: { _id: 1 } }
            ]);

            return {
                labels: analytics.map(item => item._id.toISOString().split('T')[0]),
                data: analytics.map(item => item.value)
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy analytics tùy chỉnh: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get date filter based on period
     */
    private getDateFilter(period: string): any {
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        return { $gte: startDate };
    }

    /**
     * Extract traffic source from referrer
     */
    private extractTrafficSource(referrer?: string): string {
        if (!referrer) return 'direct';

        try {
            const url = new URL(referrer);
            const hostname = url.hostname.toLowerCase();

            if (hostname.includes('google')) return 'google';
            if (hostname.includes('facebook')) return 'facebook';
            if (hostname.includes('twitter')) return 'twitter';
            if (hostname.includes('linkedin')) return 'linkedin';
            if (hostname.includes('youtube')) return 'youtube';

            return 'referral';
        } catch {
            return 'direct';
        }
    }

    /**
     * Extract device type from user agent
     */
    private extractDeviceType(userAgent: string): string {
        const ua = userAgent.toLowerCase();

        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
            return 'mobile';
        }
        if (ua.includes('tablet') || ua.includes('ipad')) {
            return 'tablet';
        }

        return 'desktop';
    }
}

export const analyticsService = new AnalyticsService();
