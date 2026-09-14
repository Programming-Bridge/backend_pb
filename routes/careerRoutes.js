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

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// GET all career openings (supports ?department=...&type=...&search=...) (Public)
careerRoutes.get('/', getAllCareers);

// GET career opening by slug (Public)
careerRoutes.get('/slug/:slug', getCareerBySlug);

// GET single career opening by ID (Public)
careerRoutes.get('/:id', getCareerById);

// Protected Mutation Routes (Admin Only)
careerRoutes.post('/seed', verifyToken, isAdmin, seedCareers);
careerRoutes.post('/', verifyToken, isAdmin, createCareer);
careerRoutes.put('/:id', verifyToken, isAdmin, updateCareer);
careerRoutes.delete('/:id', verifyToken, isAdmin, deleteCareer);

module.exports = careerRoutes;
