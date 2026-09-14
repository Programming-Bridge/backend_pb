const express = require('express');
const serviceSlideRoutes = express.Router();

const {
    getAllSlides,
    createSlide,
    updateSlide,
    deleteSlide,
} = require('../controller/serviceSlide.controller');

const {
    createSlideRules,
    updateSlideRules,
    slideIdParamRules,
} = require('../validations/serviceSlide.validation');

const validate = require('../middlewares/validate.middleware');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Public routes
serviceSlideRoutes.get('/', getAllSlides);

// Protected Mutation Routes (Admin Only)
serviceSlideRoutes.post('/add', verifyToken, isAdmin, createSlideRules, validate, createSlide);
serviceSlideRoutes.put('/update/:id', verifyToken, isAdmin, [...slideIdParamRules, ...updateSlideRules], validate, updateSlide);
serviceSlideRoutes.delete('/delete/:id', verifyToken, isAdmin, slideIdParamRules, validate, deleteSlide);

module.exports = serviceSlideRoutes;