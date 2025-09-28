import { INewsCategory } from '../../models/core/NewsCategory';
export interface CreateNewsCategoryData {
    name: string;
    slug?: string;
    description?: string;
    color?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateNewsCategoryData extends Partial<CreateNewsCategoryData> {
}
export declare const newsCategoryService: {
    getCategories(): Promise<INewsCategory[]>;
    getActiveCategories(): Promise<INewsCategory[]>;
    getCategoryById(id: string): Promise<INewsCategory | null>;
    getCategoryBySlug(slug: string): Promise<INewsCategory | null>;
    createCategory(data: CreateNewsCategoryData): Promise<INewsCategory>;
    updateCategory(id: string, data: UpdateNewsCategoryData): Promise<INewsCategory | null>;
    deleteCategory(id: string): Promise<boolean>;
    getCategoryStats(): Promise<any[]>;
    toggleCategoryStatus(id: string): Promise<INewsCategory | null>;
    updateSortOrder(categories: {
        id: string;
        sortOrder: number;
    }[]): Promise<void>;
};
export default newsCategoryService;
//# sourceMappingURL=newsCategoryService.d.ts.map