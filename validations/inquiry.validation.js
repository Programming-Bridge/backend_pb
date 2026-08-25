const { body, param, query } = require('express-validator');

// Create Inquiry Validation Rules
const createInquiryRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('projectType')
        .optional()
        .trim()
        .isString().withMessage('Project type must be a string'),

    body('serviceType')
        .optional()
        .trim()
        .isString(),

    body('budgetRange')
        .optional()
        .trim()
        .isString().withMessage('Budget range must be a string'),

    body('budget')
        .optional()
        .trim()
        .isString(),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 5, max: 5000 }).withMessage('Message must be between 5 and 5000 characters'),

    body('phone')
        .optional()
        .trim(),

    body('company')
        .optional()
        .trim(),
];

// Update Inquiry Status Validation Rules
const updateInquiryStatusRules = [
    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(['New', 'In Review', 'Contacted', 'Closed']).withMessage('Status must be one of: New, In Review, Contacted, Closed'),

    body('isRead')
        .optional()
        .isBoolean().withMessage('isRead must be a boolean (true/false)'),
];

// Inquiry Mongo ID Validation Rules
const inquiryIdParamRules = [
    param('id')
        .isMongoId().withMessage('Invalid Inquiry ID format'),
];

module.exports = {
    createInquiryRules,
    updateInquiryStatusRules,
    inquiryIdParamRules,
};
