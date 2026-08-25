const { body, param } = require('express-validator');

const createServiceCardRules = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('icon').optional().isString().trim(),
    body('badge').optional().isString().trim(),
    body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
    body('link').optional().isString().trim(),
    body('order').optional().isNumeric().withMessage('Order must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

const updateServiceCardRules = [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('icon').optional().isString().trim(),
    body('badge').optional().isString().trim(),
    body('tags').optional().isArray(),
    body('link').optional().isString().trim(),
    body('order').optional().isNumeric(),
    body('isActive').optional().isBoolean(),
];

const serviceCardIdParamRules = [
    param('id').isMongoId().withMessage('Invalid Service Card ID format'),
];

module.exports = {
    createServiceCardRules,
    updateServiceCardRules,
    serviceCardIdParamRules,
};