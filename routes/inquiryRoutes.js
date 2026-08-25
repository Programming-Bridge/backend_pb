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

const validate = require('../middlewares/validate.middleware');

// POST submit new inquiry / contact message
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

// GET all inquiries (with search, status filter, pagination)
inquiryRoutes.get('/', getAllInquiries);

// GET single inquiry by ID
inquiryRoutes.get('/:id', inquiryIdParamRules, validate, getInquiryById);

// PATCH / PUT update inquiry status (e.g. In Review, Contacted, Closed)
inquiryRoutes.patch(
    '/:id/status',
    [...inquiryIdParamRules, ...updateInquiryStatusRules],
    validate,
    updateInquiryStatus
);

inquiryRoutes.put(
    '/:id',
    [...inquiryIdParamRules, ...updateInquiryStatusRules],
    validate,
    updateInquiryStatus
);

// DELETE inquiry by ID
inquiryRoutes.delete('/:id', inquiryIdParamRules, validate, deleteInquiry);

module.exports = inquiryRoutes;
