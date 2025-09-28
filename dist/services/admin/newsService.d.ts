export interface NewsFilters {
    search?: string;
    category?: string;
    status?: string;
    author?: string;
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
declare class NewsService {
    getNews(page: number, limit: number, filters: NewsFilters): Promise<NewsListResult>;
    getNewsById(id: string): Promise<any>;
    createNews(articleData: any): Promise<any>;
    updateNews(id: string, updateData: any): Promise<any>;
    deleteNews(id: string): Promise<boolean>;
    publishNews(id: string): Promise<any>;
    getNewsCategories(): Promise<any[]>;
    createNewsCategory(categoryData: any): Promise<any>;
    updateNewsCategory(id: string, updateData: any): Promise<any>;
    deleteNewsCategory(id: string): Promise<boolean>;
    getNewsTags(): Promise<string[]>;
    createNewsTag(tagData: any): Promise<any>;
    updateNewsTag(id: string, updateData: any): Promise<any>;
    deleteNewsTag(id: string): Promise<boolean>;
}
export declare const newsService: NewsService;
export {};
//# sourceMappingURL=newsService.d.ts.map