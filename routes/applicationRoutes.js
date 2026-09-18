const express = require('express');
const applicationRoutes = express.Router();

const {
    submitApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    inviteToInterview,
    sendCandidateRejectionEmail,
    deleteApplication,
} = require('../controller/application.controller');

const { uploadResume } = require('../middlewares/upload.middleware');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// POST submit job application (Public)
applicationRoutes.post('/apply', uploadResume.any(), submitApplication);
applicationRoutes.post('/', uploadResume.any(), submitApplication);

// GET all applications (Protected: Admin Only)
applicationRoutes.get('/', verifyToken, isAdmin, getAllApplications);

// GET application by ID (Protected: Admin Only)
applicationRoutes.get('/:id', verifyToken, isAdmin, getApplicationById);

// PUT update status (Protected: Admin Only)
applicationRoutes.put('/:id', verifyToken, isAdmin, updateApplicationStatus);
applicationRoutes.patch('/:id/status', verifyToken, isAdmin, updateApplicationStatus);

// POST schedule/send interview invitation email (Protected: Admin Only)
applicationRoutes.post('/:id/invite-interview', verifyToken, isAdmin, inviteToInterview);

// POST send rejection email (Protected: Admin Only)
applicationRoutes.post('/:id/send-rejection', verifyToken, isAdmin, sendCandidateRejectionEmail);

// DELETE application (Protected: Admin Only)
applicationRoutes.delete('/:id', verifyToken, isAdmin, deleteApplication);

module.exports = applicationRoutes;
