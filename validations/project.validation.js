const { body, param } = require('express-validator');

// Create Project Validation
const createProjectRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required')
        .isString().withMessage('Project title must be a string'),

    body('description')
        .trim()
        .notEmpty().withMessage('Project description is required')
        .isString().withMessage('Project description must be a string'),

    body('shortDescription')
        .optional()
        .isString().withMessage('Short description must be a string')
        .trim(),

    body('category')
        .optional()
        .isString().withMessage('Category must be a string')
        .trim(),

    body('badge')
        .optional()
        .isString().withMessage('Badge must be a string')
        .trim(),

    body('gitLink')
        .optional()
        .isString().withMessage('Git link must be a valid string')
        .trim(),

    body('githubUrl')
        .optional()
        .isString().withMessage('GitHub URL must be a valid string')
        .trim(),

    body('liveLink')
        .optional()
        .isString().withMessage('Live link must be a valid string')
        .trim(),

    body('liveUrl')
        .optional()
        .isString().withMessage('Live URL must be a valid string')
        .trim(),

    body('client')
        .optional()
        .isString().withMessage('Client name must be a string')
        .trim(),

    body('image').optional(),
    body('img').optional(),
    body('imageUrl').optional(),
    body('projectImage').optional(),

    body('technologies')
        .optional(),

    body('tags')
        .optional(),

    body('featured')
        .optional(),

    body('order')
        .optional(),

    body('isActive')
        .optional(),
];

// Update Project Validation
const updateProjectRules = [
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Project title cannot be empty')
        .isString().withMessage('Project title must be a string'),

    body('description')
        .optional()
        .trim()
        .notEmpty().withMessage('Project description cannot be empty')
        .isString().withMessage('Project description must be a string'),

    body('shortDescription')
        .optional()
        .isString().withMessage('Short description must be a string')
        .trim(),

    body('category')
        .optional()
        .isString().withMessage('Category must be a string')
        .trim(),

    body('badge')
        .optional()
        .isString().withMessage('Badge must be a string')
        .trim(),

    body('gitLink')
        .optional()
        .isString().withMessage('Git link must be a valid string')
        .trim(),

    body('githubUrl')
        .optional()
        .isString().withMessage('GitHub URL must be a valid string')
        .trim(),

    body('liveLink')
        .optional()
        .isString().withMessage('Live link must be a valid string')
        .trim(),

    body('liveUrl')
        .optional()
        .isString().withMessage('Live URL must be a valid string')
        .trim(),

    body('client')
        .optional()
        .isString().withMessage('Client name must be a string')
        .trim(),

    body('image').optional(),
    body('img').optional(),
    body('imageUrl').optional(),
    body('projectImage').optional(),

    body('technologies')
        .optional(),

    body('tags')
        .optional(),

    body('featured')
        .optional(),

    body('order')
        .optional(),

    body('isActive')
        .optional(),
];

// Mongo ID Param Validation
const projectIdParamRules = [
    param('id')
        .isMongoId().withMessage('Invalid Project ID format'),
];

// Slug Param Validation
const projectSlugParamRules = [
    param('slug')
        .trim()
        .notEmpty().withMessage('Slug parameter is required')
        .isString().withMessage('Slug must be a valid string'),
];

module.exports = {
    createProjectRules,
    updateProjectRules,
    projectIdParamRules,
    projectSlugParamRules,
};
