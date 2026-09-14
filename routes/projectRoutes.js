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
    seedProjects,
} = require('../controller/project.controller');

const {
    createProjectRules,
    updateProjectRules,
    projectIdParamRules,
    projectSlugParamRules,
} = require('../validations/project.validation');

const { uploadProject } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// GET all projects (Public with filtering)
projectRoutes.get('/', getAllProjects);

// GET project by Slug (Public)
projectRoutes.get('/slug/:slug', projectSlugParamRules, validate, getProjectBySlug);

// GET single project by Mongo ID (Public)
projectRoutes.get('/:id', projectIdParamRules, validate, getProjectById);

// POST seed / reset projects (Protected: Admin Only)
projectRoutes.post('/seed', verifyToken, isAdmin, seedProjects);

// POST create single project (Protected: Admin Only)
projectRoutes.post(
    '/add',
    verifyToken,
    isAdmin,
    uploadProject.any(),
    createProjectRules,
    validate,
    createProject
);
projectRoutes.post(
    '/',
    verifyToken,
    isAdmin,
    uploadProject.any(),
    createProjectRules,
    validate,
    createProject
);

// POST bulk create projects (Protected: Admin Only)
projectRoutes.post('/bulk-add', verifyToken, isAdmin, createBulkProjects);

// PUT update project by ID (Protected: Admin Only)
projectRoutes.put(
    '/update/:id',
    verifyToken,
    isAdmin,
    uploadProject.any(),
    [...projectIdParamRules, ...updateProjectRules],
    validate,
    updateProject
);
projectRoutes.put(
    '/:id',
    verifyToken,
    isAdmin,
    uploadProject.any(),
    [...projectIdParamRules, ...updateProjectRules],
    validate,
    updateProject
);

// DELETE project by ID (Protected: Admin Only)
projectRoutes.delete(
    '/delete/:id',
    verifyToken,
    isAdmin,
    projectIdParamRules,
    validate,
    deleteProject
);
projectRoutes.delete(
    '/:id',
    verifyToken,
    isAdmin,
    projectIdParamRules,
    validate,
    deleteProject
);

module.exports = projectRoutes;
