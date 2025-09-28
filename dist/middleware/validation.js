"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateNewsCategory = exports.validateNewsCategory = exports.validateSearch = exports.validatePagination = exports.validateObjectId = exports.validateConsultationRequest = exports.validateNewsletterSubscription = exports.validateContactMessage = exports.validateNews = exports.validateProduct = exports.validateProject = exports.validateUser = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
exports.validateRequest = validateRequest;
exports.validateUser = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Tên phải có từ 3-100 ký tự'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Mật khẩu phải có ít nhất 8 ký tự'),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^\+?[0-9]{10,15}$/)
        .withMessage('Số điện thoại không hợp lệ'),
    exports.validateRequest
];
exports.validateProject = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Tên dự án phải có từ 5-200 ký tự'),
    (0, express_validator_1.body)('description')
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Mô tả phải có từ 20-2000 ký tự'),
    (0, express_validator_1.body)('location')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Địa điểm phải có từ 5-200 ký tự'),
    (0, express_validator_1.body)('type')
        .isIn(['apartment', 'villa', 'office', 'commercial'])
        .withMessage('Loại dự án không hợp lệ'),
    (0, express_validator_1.body)('status')
        .isIn(['planning', 'construction', 'completed', 'sold_out'])
        .withMessage('Trạng thái dự án không hợp lệ'),
    (0, express_validator_1.body)('price.min')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Giá tối thiểu phải là số dương'),
    (0, express_validator_1.body)('price.max')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Giá tối đa phải là số dương'),
    (0, express_validator_1.body)('area.min')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Diện tích tối thiểu phải là số dương'),
    (0, express_validator_1.body)('area.max')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Diện tích tối đa phải là số dương'),
    exports.validateRequest
];
exports.validateProduct = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Tên sản phẩm phải có từ 3-200 ký tự'),
    (0, express_validator_1.body)('description')
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Mô tả phải có từ 20-2000 ký tự'),
    (0, express_validator_1.body)('categoryId')
        .isMongoId()
        .withMessage('ID danh mục không hợp lệ'),
    (0, express_validator_1.body)('originId')
        .isMongoId()
        .withMessage('ID xuất xứ không hợp lệ'),
    (0, express_validator_1.body)('grade')
        .isIn(['premium', 'standard', 'economy'])
        .withMessage('Cấp độ sản phẩm không hợp lệ'),
    (0, express_validator_1.body)('weight')
        .isNumeric()
        .isFloat({ min: 0.1, max: 1000 })
        .withMessage('Trọng lượng phải từ 0.1-1000'),
    (0, express_validator_1.body)('price')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Giá phải là số dương'),
    (0, express_validator_1.body)('stock')
        .isNumeric()
        .isInt({ min: 0 })
        .withMessage('Số lượng tồn kho phải là số nguyên dương'),
    exports.validateRequest
];
exports.validateNews = [
    (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Tiêu đề phải có từ 5-200 ký tự'),
    (0, express_validator_1.body)('excerpt')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Tóm tắt phải có từ 10-500 ký tự'),
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 50 })
        .withMessage('Nội dung phải có ít nhất 50 ký tự'),
    (0, express_validator_1.body)('categoryId')
        .isMongoId()
        .withMessage('ID chuyên mục không hợp lệ'),
    (0, express_validator_1.body)('status')
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Trạng thái bài viết không hợp lệ'),
    exports.validateRequest
];
exports.validateContactMessage = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Tên phải có từ 3-100 ký tự'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    (0, express_validator_1.body)('subject')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Chủ đề phải có từ 5-200 ký tự'),
    (0, express_validator_1.body)('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Nội dung tin nhắn phải có từ 10-2000 ký tự'),
    exports.validateRequest
];
exports.validateNewsletterSubscription = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên phải có từ 2-100 ký tự'),
    exports.validateRequest
];
exports.validateConsultationRequest = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Tên phải có từ 3-100 ký tự'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    (0, express_validator_1.body)('phone')
        .matches(/^\+?[0-9]{10,15}$/)
        .withMessage('Số điện thoại không hợp lệ'),
    (0, express_validator_1.body)('serviceType')
        .isIn(['real_estate', 'ginseng', 'general'])
        .withMessage('Loại dịch vụ không hợp lệ'),
    (0, express_validator_1.body)('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Nội dung tin nhắn phải có từ 10-2000 ký tự'),
    exports.validateRequest
];
exports.validateObjectId = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID không hợp lệ'),
    exports.validateRequest
];
exports.validatePagination = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Trang phải là số nguyên dương'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Giới hạn phải từ 1-100'),
    exports.validateRequest
];
exports.validateSearch = [
    (0, express_validator_1.query)('q')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Từ khóa tìm kiếm phải có từ 1-100 ký tự'),
    exports.validateRequest
];
exports.validateNewsCategory = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên danh mục phải có từ 2-100 ký tự'),
    (0, express_validator_1.body)('slug')
        .optional()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Mô tả không được quá 500 ký tự'),
    (0, express_validator_1.body)('color')
        .optional()
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('Màu sắc phải là mã hex hợp lệ'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('Trạng thái phải là boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Thứ tự sắp xếp phải là số nguyên không âm'),
    exports.validateRequest
];
exports.validateCreateNewsCategory = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên danh mục phải có từ 2-100 ký tự'),
    (0, express_validator_1.body)('slug')
        .optional()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Mô tả không được quá 500 ký tự'),
    (0, express_validator_1.body)('color')
        .optional()
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('Màu sắc phải là mã hex hợp lệ'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('Trạng thái phải là boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Thứ tự sắp xếp phải là số nguyên không âm'),
    exports.validateRequest
];
//# sourceMappingURL=validation.js.map