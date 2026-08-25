const express = require('express');
const careerRoutes = express.Router();

const {
    getAllCareers,
    getCareerById,
    getCareerBySlug,
    createCareer,
    updateCareer,
    deleteCareer,
    seedCareers,
} = require('../controller/career.controller');

// GET all career openings (supports ?department=...&type=...&search=...)
careerRoutes.get('/', getAllCareers);

// POST seed career openings
careerRoutes.post('/seed', seedCareers);

// GET career opening by slug
careerRoutes.get('/slug/:slug', getCareerBySlug);

// GET single career opening by ID
careerRoutes.get('/:id', getCareerById);

// POST create career opening
careerRoutes.post('/', createCareer);

// PUT update career opening
careerRoutes.put('/:id', updateCareer);

// DELETE career opening
careerRoutes.delete('/:id', deleteCareer);

module.exports = careerRoutes;
