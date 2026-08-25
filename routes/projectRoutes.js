const express = require('express');
const projectRoutes = express.Router();

const {
    getAllProjects,
    getProjectById,
    getProjectBySlug,
    createProject,
    createBulkProjects,
    updateProject,
    deleteProject,
} = require('../controller/project.controller');

const {
    createProjectRules,
    updateProjectRules,
    projectIdParamRules,
    projectSlugParamRules,
} = require('../validations/project.validation');

const { uploadProject } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');

// GET all projects (with filtering)
projectRoutes.get('/', getAllProjects);

// GET project by Slug (placed before :id route so slug doesn't conflict)
projectRoutes.get('/slug/:slug', projectSlugParamRules, validate, getProjectBySlug);

// GET single project by Mongo ID
projectRoutes.get('/:id', projectIdParamRules, validate, getProjectById);

// POST create single project (supports image, img, file, etc.)
projectRoutes.post(
    '/add',
    uploadProject.any(),
    createProjectRules,
    validate,
    createProject
);
projectRoutes.post(
    '/',
    uploadProject.any(),
    createProjectRules,
    validate,
    createProject
);

// POST bulk create projects (JSON array)
projectRoutes.post('/bulk-add', createBulkProjects);

// PUT update project by ID (with optional image file upload)
projectRoutes.put(
    '/update/:id',
    uploadProject.any(),
    [...projectIdParamRules, ...updateProjectRules],
    validate,
    updateProject
);
projectRoutes.put(
    '/:id',
    uploadProject.any(),
    [...projectIdParamRules, ...updateProjectRules],
    validate,
    updateProject
);

// DELETE project by ID
projectRoutes.delete(
    '/delete/:id',
    projectIdParamRules,
    validate,
    deleteProject
);
projectRoutes.delete(
    '/:id',
    projectIdParamRules,
    validate,
    deleteProject
);

module.exports = projectRoutes;
