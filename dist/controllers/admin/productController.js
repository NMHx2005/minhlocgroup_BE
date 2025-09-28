"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrigin = exports.updateOrigin = exports.createOrigin = exports.getOrigins = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const productService_1 = require("@/services/admin/productService");
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, grade, status, origin, priceMin, priceMax, weightMin, weightMax, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const filters = {
            search: search,
            category: category,
            grade: grade,
            status: status,
            origin: origin,
            priceMin: priceMin ? parseInt(priceMin) : undefined,
            priceMax: priceMax ? parseInt(priceMax) : undefined,
            weightMin: weightMin ? parseInt(weightMin) : undefined,
            weightMax: weightMax ? parseInt(weightMax) : undefined,
            sortBy: sortBy,
            sortOrder: sortOrder
        };
        const result = await productService_1.productService.getProducts(parseInt(page), parseInt(limit), filters);
        res.json({
            success: true,
            data: {
                products: result.products,
                total: result.pagination.total
            },
            pagination: result.pagination
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
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
        return;
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            createdBy: req.user?.id,
            updatedBy: req.user?.id
        };
        const product = await productService_1.productService.createProduct(productData);
        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: product
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = {
            ...req.body,
            updatedBy: req.user?.id
        };
        const product = await productService_1.productService.updateProduct(id, productData);
        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: product
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productService_1.productService.deleteProduct(id);
        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sản phẩm',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteProduct = deleteProduct;
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
            message: 'Lỗi khi lấy danh sách phân loại',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const categoryData = {
            ...req.body,
            createdBy: req.user?.id,
            updatedBy: req.user?.id
        };
        const category = await productService_1.productService.createCategory(categoryData);
        res.status(201).json({
            success: true,
            message: 'Tạo phân loại thành công',
            data: category
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo phân loại',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryData = {
            ...req.body,
            updatedBy: req.user?.id
        };
        const category = await productService_1.productService.updateCategory(id, categoryData);
        res.json({
            success: true,
            message: 'Cập nhật phân loại thành công',
            data: category
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật phân loại',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await productService_1.productService.deleteCategory(id);
        res.json({
            success: true,
            message: 'Xóa phân loại thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa phân loại',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteCategory = deleteCategory;
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
        return;
    }
};
exports.getOrigins = getOrigins;
const createOrigin = async (req, res) => {
    try {
        const originData = {
            ...req.body,
            createdBy: req.user?.id,
            updatedBy: req.user?.id
        };
        const origin = await productService_1.productService.createOrigin(originData);
        res.status(201).json({
            success: true,
            message: 'Tạo xuất xứ thành công',
            data: origin
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createOrigin = createOrigin;
const updateOrigin = async (req, res) => {
    try {
        const { id } = req.params;
        const originData = {
            ...req.body,
            updatedBy: req.user?.id
        };
        const origin = await productService_1.productService.updateOrigin(id, originData);
        res.json({
            success: true,
            message: 'Cập nhật xuất xứ thành công',
            data: origin
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateOrigin = updateOrigin;
const deleteOrigin = async (req, res) => {
    try {
        const { id } = req.params;
        await productService_1.productService.deleteOrigin(id);
        res.json({
            success: true,
            message: 'Xóa xuất xứ thành công'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa xuất xứ',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteOrigin = deleteOrigin;
//# sourceMappingURL=productController.js.map