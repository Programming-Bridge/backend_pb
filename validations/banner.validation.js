const { body, param } = require('express-validator');

// Create Banner Validation
const createBannerRules = [
    body('pageType')
        .trim()
        .notEmpty().withMessage('Page type is required')
        .isString().withMessage('Page type must be a string'),

    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string'),

    body('badge')
        .optional()
        .isString().withMessage('Badge must be a string')
        .trim(),

    body('subTitle')
        .optional()
        .isString().withMessage('Subtitle must be a string')
        .trim(),

    body('primaryBtnText')
        .optional()
        .isString().withMessage('Primary button text must be a string')
        .trim(),

    body('primaryBtnLink')
        .optional()
        .isString().withMessage('Primary button link must be a string')
        .trim(),

    body('secondaryBtnText')
        .optional()
        .isString().withMessage('Secondary button text must be a string')
        .trim(),

    body('secondaryBtnLink')
        .optional()
        .isString().withMessage('Secondary button link must be a string')
        .trim(),

    body('image').optional(),
    body('img').optional(),
    body('imageUrl').optional(),
    body('bannerImage').optional(),

    body('imageAlt')
        .optional()
        .isString().withMessage('Image alt text must be a string')
        .trim(),

    body('features').optional(),
    body('isActive').optional(),
    body('order').optional(),
];

// Update Banner Validation
const updateBannerRules = [
    body('pageType')
        .optional()
        .trim()
        .notEmpty().withMessage('Page type cannot be empty')
        .isString().withMessage('Page type must be a string'),

    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Title cannot be empty')
        .isString().withMessage('Title must be a string'),

    body('description')
        .optional()
        .trim()
        .notEmpty().withMessage('Description cannot be empty')
        .isString().withMessage('Description must be a string'),

    body('badge')
        .optional()
        .isString().trim(),

    body('subTitle')
        .optional()
        .isString().trim(),

    body('primaryBtnText')
        .optional()
        .isString().trim(),

    body('primaryBtnLink')
        .optional()
        .isString().trim(),

    body('secondaryBtnText')
        .optional()
        .isString().trim(),

    body('secondaryBtnLink')
        .optional()
        .isString().trim(),

    body('image').optional(),
    body('img').optional(),
    body('imageUrl').optional(),
    body('bannerImage').optional(),

    body('imageAlt')
        .optional()
        .isString().trim(),

    body('features').optional(),
    body('isActive').optional(),
    body('order').optional(),
];

// Mongo ID Param Validation
const bannerIdParamRules = [
    param('id')
        .isMongoId().withMessage('Invalid Banner ID format')
];

// Page Type Param Validation (For /page/:pageType route)
const pageTypeParamRules = [
    param('pageType')
        .trim()
        .notEmpty().withMessage('Page type parameter is required')
        .isString().withMessage('Page type must be a valid string')
];

module.exports = {
    createBannerRules,
    updateBannerRules,
    bannerIdParamRules,
    pageTypeParamRules
};