export interface NewsFilters {
    search?: string;
    category?: string;
    tag?: string;
}
export interface NewsListResult {
    articles: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export interface NewsSearchParams {
    query?: string;
    category?: string;
    tag?: string;
    dateFrom?: string;
    dateTo?: string;
}
declare class NewsService {
    getNews(page: number, limit: number, filters: NewsFilters): Promise<NewsListResult>;
    getNewsById(id: string): Promise<any>;
    getNewsBySlug(slug: string): Promise<any>;
    getFeaturedNews(limit?: number): Promise<any[]>;
    getLatestNews(limit?: number): Promise<any[]>;
    getNewsByCategory(categoryId: string, page: number, limit: number): Promise<NewsListResult>;
    searchNews(searchParams: NewsSearchParams): Promise<any[]>;
    getNewsCategories(): Promise<any[]>;
    getNewsTags(): Promise<string[]>;
    getRelatedNews(articleId: string, limit?: number): Promise<any[]>;
    incrementViewCount(articleId: string): Promise<void>;
}
export declare const newsService: NewsService;
export {};
//# sourceMappingURL=newsService.d.ts.map