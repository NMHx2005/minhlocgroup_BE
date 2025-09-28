export interface ProductFilters {
    search?: string;
    category?: string;
    grade?: string;
    minPrice?: number;
    maxPrice?: number;
}
export interface ProductListResult {
    products: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export interface ProductSearchParams {
    query?: string;
    category?: string;
    grade?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}
declare class ProductService {
    getProducts(page: number, limit: number, filters: ProductFilters): Promise<ProductListResult>;
    getProductById(id: string): Promise<any>;
    getProductBySlug(slug: string): Promise<any>;
    getFeaturedProducts(limit?: number): Promise<any[]>;
    getProductsByCategory(categoryId: string, page: number, limit: number): Promise<ProductListResult>;
    getProductsByOrigin(originId: string, page: number, limit: number): Promise<ProductListResult>;
    searchProducts(searchParams: ProductSearchParams): Promise<any[]>;
    getCategories(): Promise<any[]>;
    getOrigins(): Promise<any[]>;
}
export declare const productService: ProductService;
export {};
//# sourceMappingURL=productService.d.ts.map