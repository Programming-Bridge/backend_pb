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

serviceSlideRoutes.get('/', getAllSlides);
serviceSlideRoutes.post('/add', createSlideRules, validate, createSlide);
serviceSlideRoutes.put('/update/:id', [...slideIdParamRules, ...updateSlideRules], validate, updateSlide);
serviceSlideRoutes.delete('/delete/:id', slideIdParamRules, validate, deleteSlide);

module.exports = serviceSlideRoutes;