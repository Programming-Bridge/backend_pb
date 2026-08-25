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

// Public endpoints
techStackRoutes.get('/', getAllTechnologies);
techStackRoutes.get('/:id', getTechnologyById);

// Mutation endpoints
techStackRoutes.post('/', createTechnology);
techStackRoutes.post('/add', createTechnology);
techStackRoutes.post('/bulk', bulkAddTechnologies);
techStackRoutes.post('/seed', seedTechnologies);

techStackRoutes.put('/:id', updateTechnology);
techStackRoutes.patch('/:id', updateTechnology);
techStackRoutes.delete('/:id', deleteTechnology);

module.exports = techStackRoutes;
