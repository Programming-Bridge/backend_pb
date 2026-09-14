const express = require('express');
const techStackRoutes = express.Router();

const {
    getAllTechnologies,
    getTechnologyById,
    createTechnology,
    bulkAddTechnologies,
    updateTechnology,
    deleteTechnology,
    seedTechnologies,
} = require('../controller/techStack.controller');

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Public endpoints
techStackRoutes.get('/', getAllTechnologies);
techStackRoutes.get('/:id', getTechnologyById);

// Protected Mutation endpoints (Admin Only)
techStackRoutes.post('/', verifyToken, isAdmin, createTechnology);
techStackRoutes.post('/add', verifyToken, isAdmin, createTechnology);
techStackRoutes.post('/bulk', verifyToken, isAdmin, bulkAddTechnologies);
techStackRoutes.post('/seed', verifyToken, isAdmin, seedTechnologies);

techStackRoutes.put('/:id', verifyToken, isAdmin, updateTechnology);
techStackRoutes.patch('/:id', verifyToken, isAdmin, updateTechnology);
techStackRoutes.delete('/:id', verifyToken, isAdmin, deleteTechnology);

module.exports = techStackRoutes;
