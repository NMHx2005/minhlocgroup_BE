import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array()
        });
        return;
    }
    next();
};

// User validation
export const validateUser = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Tên phải có từ 3-100 ký tự'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Mật khẩu phải có ít nhất 8 ký tự'),
    body('phone')
        .optional()
        .matches(/^\+?[0-9]{10,15}$/)
        .withMessage('Số điện thoại không hợp lệ'),
    validateRequest
];

// Project validation
export const validateProject = [
    body('name')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Tên dự án phải có từ 5-200 ký tự'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Mô tả phải có từ 20-2000 ký tự'),
    body('location')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Địa điểm phải có từ 5-200 ký tự'),
    body('type')
        .isIn(['apartment', 'villa', 'office', 'commercial'])
        .withMessage('Loại dự án không hợp lệ'),
    body('status')
        .isIn(['planning', 'construction', 'completed', 'sold_out'])
        .withMessage('Trạng thái dự án không hợp lệ'),
    body('price.min')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Giá tối thiểu phải là số dương'),
    body('price.max')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Giá tối đa phải là số dương'),
    body('area.min')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Diện tích tối thiểu phải là số dương'),
    body('area.max')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Diện tích tối đa phải là số dương'),
    validateRequest
];

// Product validation
export const validateProduct = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Tên sản phẩm phải có từ 3-200 ký tự'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Mô tả phải có từ 20-2000 ký tự'),
    body('categoryId')
        .isMongoId()
        .withMessage('ID danh mục không hợp lệ'),
    body('originId')
        .isMongoId()
        .withMessage('ID xuất xứ không hợp lệ'),
    body('grade')
        .isIn(['premium', 'standard', 'economy'])
        .withMessage('Cấp độ sản phẩm không hợp lệ'),
    body('weight')
        .isNumeric()
        .isFloat({ min: 0.1, max: 1000 })
        .withMessage('Trọng lượng phải từ 0.1-1000'),
    body('price')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Giá phải là số dương'),
    body('stock')
        .isNumeric()
        .isInt({ min: 0 })
        .withMessage('Số lượng tồn kho phải là số nguyên dương'),
    validateRequest
];

// News validation
export const validateNews = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Tiêu đề phải có từ 5-200 ký tự'),
    body('excerpt')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Tóm tắt phải có từ 10-500 ký tự'),
    body('content')
        .trim()
        .isLength({ min: 50 })
        .withMessage('Nội dung phải có ít nhất 50 ký tự'),
    body('categoryId')
        .isMongoId()
        .withMessage('ID chuyên mục không hợp lệ'),
    body('status')
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Trạng thái bài viết không hợp lệ'),
    validateRequest
];

// Contact message validation
export const validateContactMessage = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Tên phải có từ 3-100 ký tự'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    body('subject')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Chủ đề phải có từ 5-200 ký tự'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Nội dung tin nhắn phải có từ 10-2000 ký tự'),
    validateRequest
];

// Newsletter subscription validation
export const validateNewsletterSubscription = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên phải có từ 2-100 ký tự'),
    validateRequest
];

// Consultation request validation
export const validateConsultationRequest = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Tên phải có từ 3-100 ký tự'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    body('phone')
        .matches(/^\+?[0-9]{10,15}$/)
        .withMessage('Số điện thoại không hợp lệ'),
    body('serviceType')
        .isIn(['real_estate', 'ginseng', 'general'])
        .withMessage('Loại dịch vụ không hợp lệ'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Nội dung tin nhắn phải có từ 10-2000 ký tự'),
    validateRequest
];

// ID validation
export const validateObjectId = [
    param('id')
        .isMongoId()
        .withMessage('ID không hợp lệ'),
    validateRequest
];

// Pagination validation
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Trang phải là số nguyên dương'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Giới hạn phải từ 1-100'),
    validateRequest
];

// Search validation
export const validateSearch = [
    query('q')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Từ khóa tìm kiếm phải có từ 1-100 ký tự'),
    validateRequest
];

// News category validation
export const validateNewsCategory = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên danh mục phải có từ 2-100 ký tự'),
    body('slug')
        .optional()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Mô tả không được quá 500 ký tự'),
    body('color')
        .optional()
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('Màu sắc phải là mã hex hợp lệ'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Trạng thái phải là boolean'),
    body('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Thứ tự sắp xếp phải là số nguyên không âm'),
    validateRequest
];

// News category validation for create (name is required)
export const validateCreateNewsCategory = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên danh mục phải có từ 2-100 ký tự'),
    body('slug')
        .optional()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Mô tả không được quá 500 ký tự'),
    body('color')
        .optional()
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('Màu sắc phải là mã hex hợp lệ'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Trạng thái phải là boolean'),
    body('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Thứ tự sắp xếp phải là số nguyên không âm'),
    validateRequest
];