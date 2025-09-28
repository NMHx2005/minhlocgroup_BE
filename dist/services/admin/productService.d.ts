export interface ProductFilters {
    search?: string;
    category?: string;
    grade?: string;
    status?: string;
    origin?: string;
    priceMin?: number;
    priceMax?: number;
    weightMin?: number;
    weightMax?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
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
declare class ProductService {
    getProducts(page: number, limit: number, filters: ProductFilters): Promise<ProductListResult>;
    getProductById(id: string): Promise<any>;
    createProduct(productData: any): Promise<any>;
    updateProduct(id: string, updateData: any): Promise<any>;
    deleteProduct(id: string): Promise<boolean>;
    getCategories(): Promise<any[]>;
    createCategory(categoryData: any): Promise<any>;
    updateCategory(id: string, updateData: any): Promise<any>;
    deleteCategory(id: string): Promise<boolean>;
    getOrigins(): Promise<any[]>;
    createOrigin(originData: any): Promise<any>;
    updateOrigin(id: string, updateData: any): Promise<any>;
    deleteOrigin(id: string): Promise<boolean>;
}
export declare const productService: ProductService;
export {};
//# sourceMappingURL=productService.d.ts.map