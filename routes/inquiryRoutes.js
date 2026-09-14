const express = require('express');
const inquiryRoutes = express.Router();

const {
    createInquiry,
    getAllInquiries,
    getInquiryById,
    updateInquiryStatus,
    deleteInquiry,
} = require('../controller/inquiry.controller');

const {
    createInquiryRules,
    updateInquiryStatusRules,
    inquiryIdParamRules,
} = require('../validations/inquiry.validation');

const { uploadResume } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// POST submit new inquiry / contact message (Public)
inquiryRoutes.post(
    '/send',
    createInquiryRules,
    validate,
    createInquiry
);

inquiryRoutes.post(
    '/',
    createInquiryRules,
    validate,
    createInquiry
);

// GET all inquiries (Protected: Admin Only)
inquiryRoutes.get('/', verifyToken, isAdmin, getAllInquiries);

// GET single inquiry by ID (Protected: Admin Only)
inquiryRoutes.get('/:id', verifyToken, isAdmin, inquiryIdParamRules, validate, getInquiryById);

// PATCH / PUT update inquiry status (Protected: Admin Only)
inquiryRoutes.patch(
    '/:id/status',
    verifyToken,
    isAdmin,
    [...inquiryIdParamRules, ...updateInquiryStatusRules],
    validate,
    updateInquiryStatus
);

inquiryRoutes.put(
    '/:id',
    verifyToken,
    isAdmin,
    [...inquiryIdParamRules, ...updateInquiryStatusRules],
    validate,
    updateInquiryStatus
);

// DELETE inquiry by ID (Protected: Admin Only)
inquiryRoutes.delete('/:id', verifyToken, isAdmin, inquiryIdParamRules, validate, deleteInquiry);

module.exports = inquiryRoutes;
