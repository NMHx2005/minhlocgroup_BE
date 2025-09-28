"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrigins = exports.getCategories = exports.searchProducts = exports.getProductsByOrigin = exports.getProductsByCategory = exports.getFeaturedProducts = exports.getProductBySlug = exports.getProductById = exports.getProducts = void 0;
const productService_1 = require("@/services/client/productService");
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, grade, minPrice, maxPrice } = req.query;
        const filters = {
            ...(search && { search: search }),
            ...(category && { category: category }),
            ...(grade && { grade: grade }),
            ...(minPrice && { minPrice: parseInt(minPrice) }),
            ...(maxPrice && { maxPrice: parseInt(maxPrice) })
        };
        const result = await productService_1.productService.getProducts(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService_1.productService.getProductById(id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
            ;
            return;
        }
        res.json({
            success: true,
            data: product
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProductById = getProductById;
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await productService_1.productService.getProductBySlug(slug);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
            ;
            return;
        }
        res.json({
            success: true,
            data: product
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProductBySlug = getProductBySlug;
const getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        const products = await productService_1.productService.getFeaturedProducts(parseInt(limit));
        res.json({
            success: true,
            data: products
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm nổi bật',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const result = await productService_1.productService.getProductsByCategory(categoryId, parseInt(page), parseInt(limit));
        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm theo danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProductsByCategory = getProductsByCategory;
const getProductsByOrigin = async (req, res) => {
    try {
        const { originId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const result = await productService_1.productService.getProductsByOrigin(originId, parseInt(page), parseInt(limit));
        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm theo xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getProductsByOrigin = getProductsByOrigin;
const searchProducts = async (req, res) => {
    try {
        const { q, category, grade, minPrice, maxPrice, inStock } = req.query;
        const searchParams = {
            query: q,
            category: category,
            grade: grade,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            inStock: inStock === 'true'
        };
        const products = await productService_1.productService.searchProducts(searchParams);
        res.json({
            success: true,
            data: products
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.searchProducts = searchProducts;
const getCategories = async (req, res) => {
    try {
        const categories = await productService_1.productService.getCategories();
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách danh mục',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getCategories = getCategories;
const getOrigins = async (req, res) => {
    try {
        const origins = await productService_1.productService.getOrigins();
        res.json({
            success: true,
            data: origins
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        ;
        return;
    }
};
exports.getOrigins = getOrigins;
