const { body, param } = require('express-validator');

const createSlideRules = [
    body('slideNumber').trim().notEmpty().withMessage('Slide number is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('icon').optional().isString().trim(),
    body('link').optional().isString().trim(),
    body('order').optional().isNumeric().withMessage('Order must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

const updateSlideRules = [
    body('slideNumber').optional().trim().notEmpty().withMessage('Slide number cannot be empty'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('icon').optional().isString().trim(),
    body('link').optional().isString().trim(),
    body('order').optional().isNumeric(),
    body('isActive').optional().isBoolean(),
];

const slideIdParamRules = [
    param('id').isMongoId().withMessage('Invalid Slide ID format'),
];

module.exports = {
    createSlideRules,
    updateSlideRules,
    slideIdParamRules,
};