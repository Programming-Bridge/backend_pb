const { body } = require('express-validator');

// Register validation rules
const registerRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('role')
        .optional()
        .isIn(['admin', 'superadmin', 'editor']).withMessage('Role must be admin, superadmin, or editor'),
];

// Login validation rules
const loginRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required'),
];

// Change Password validation rules
const changePasswordRules = [
    body('currentPassword')
        .trim()
        .notEmpty().withMessage('Current password is required'),

    body('newPassword')
        .trim()
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

module.exports = {
    registerRules,
    loginRules,
    changePasswordRules,
};
