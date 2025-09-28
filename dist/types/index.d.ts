export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    company?: string;
    type: 'individual' | 'business';
    status: 'active' | 'inactive' | 'blocked';
    role: 'admin' | 'editor' | 'viewer' | 'customer';
    avatar?: string;
    notes?: string;
    interests?: string[];
    totalOrders: number;
    totalSpent: number;
    lastActivity: Date;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface Project {
    id: string;
    name: string;
    description: string;
    location: string;
    type: 'apartment' | 'villa' | 'office' | 'commercial';
    status: 'planning' | 'construction' | 'completed' | 'sold_out';
    price: {
        min: number;
        max: number;
        currency: string;
    };
    area: {
        min: number;
        max: number;
        unit: string;
    };
    images: string[];
    features: string[];
    amenities: string[];
    developer: string;
    completionDate?: Date;
    totalUnits: number;
    soldUnits: number;
    salesRate: number;
    revenue: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface GinsengProduct {
    id: string;
    name: string;
    description: string;
    category: 'ngoc_linh' | 'han_quoc' | 'korean_red' | 'other';
    origin: string;
    grade: 'premium' | 'standard' | 'economy';
    weight: number;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out_of_stock';
    images: string[];
    features: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    categoryId: string;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    author: {
        id: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface NewsCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: string;
    reply?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
export interface AuthRequest extends Request {
    user?: User;
}
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number, isOperational?: boolean);
}
export interface ValidationError {
    field: string;
    message: string;
}
//# sourceMappingURL=index.d.ts.map