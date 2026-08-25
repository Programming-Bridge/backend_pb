const { body, param } = require('express-validator');

const createNavItemRules = [
    body('label')
        .trim()
        .notEmpty().withMessage('Label is required')
        .isString().withMessage('Label must be a string'),

    body('path')
        .trim()
        .notEmpty().withMessage('Path is required')
        .isString().withMessage('Path must be a string'),

    body('order')
        .optional()
        .isNumeric().withMessage('Order must be a number'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),

    body('hasDropDown')
        .optional()
        .isBoolean().withMessage('hasDropDown must be a boolean'),

    body('dropDown')
        .optional()
        .isArray().withMessage('dropDown must be an array'),

    body('dropDown.*.label')
        .if(body('dropDown').isArray({ min: 1 }))
        .trim()
        .notEmpty().withMessage('Dropdown label is required'),

    body('dropDown.*.path')
        .if(body('dropDown').isArray({ min: 1 }))
        .trim()
        .notEmpty().withMessage('Dropdown path is required'),

    body('dropDown.*.order')
        .optional()
        .isNumeric().withMessage('Dropdown order must be a number')
];

const updateNavItemRules = [
    body('label')
        .optional()
        .trim()
        .notEmpty().withMessage('Label cannot be empty')
        .isString().withMessage('Label must be a string'),

    body('path')
        .optional()
        .trim()
        .notEmpty().withMessage('Path cannot be empty')
        .isString().withMessage('Path must be a string'),

    body('order')
        .optional()
        .isNumeric().withMessage('Order must be a number'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),

    body('hasDropDown')
        .optional()
        .isBoolean().withMessage('hasDropDown must be a boolean'),

    body('dropDown')
        .optional()
        .isArray().withMessage('dropDown must be an array')
];

const mongoIdParamRules = [
    param('id')
        .isMongoId().withMessage('Invalid MongoDB ID format')
];

module.exports = {
    createNavItemRules,
    updateNavItemRules,
    mongoIdParamRules
};