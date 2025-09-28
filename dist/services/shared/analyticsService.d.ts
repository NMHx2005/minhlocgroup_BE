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
declare class AnalyticsService {
    getAnalyticsOverview(period: string): Promise<AnalyticsOverview>;
    getPageViewsAnalytics(period: string, page?: string): Promise<any[]>;
    getUniqueVisitorsAnalytics(period: string): Promise<any>;
    getBounceRateAnalytics(period: string): Promise<any>;
    getSessionDurationAnalytics(period: string): Promise<any>;
    getTopPagesAnalytics(period: string, limit?: number): Promise<any[]>;
    getTrafficSourcesAnalytics(period: string): Promise<any[]>;
    getDeviceAnalytics(period: string): Promise<any[]>;
    getLocationAnalytics(period: string, limit?: number): Promise<any[]>;
    getRealTimeAnalytics(): Promise<any>;
    trackPageView(trackingData: PageViewTrackingData): Promise<void>;
    getCustomAnalytics(metric: string, period: string, dimensions?: string): Promise<any>;
    private getDateFilter;
    private extractTrafficSource;
    private extractDeviceType;
}
export declare const analyticsService: AnalyticsService;
export {};
//# sourceMappingURL=analyticsService.d.ts.map