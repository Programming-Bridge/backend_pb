const express = require('express');
const applicationRoutes = express.Router();

const {
    submitApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
} = require('../controller/application.controller');

const { uploadResume } = require('../middlewares/upload.middleware');

// POST submit job application (receives candidate data, file upload, and triggers email)
applicationRoutes.post('/apply', uploadResume.any(), submitApplication);
applicationRoutes.post('/', uploadResume.any(), submitApplication);

// GET all applications
applicationRoutes.get('/', getAllApplications);

// GET application by ID
applicationRoutes.get('/:id', getApplicationById);

// PUT update status
applicationRoutes.put('/:id', updateApplicationStatus);

// DELETE application
applicationRoutes.delete('/:id', deleteApplication);

module.exports = applicationRoutes;
