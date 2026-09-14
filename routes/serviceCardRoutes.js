const express = require('express');
const serviceCardRoutes = express.Router();

const {
    getAllServiceCards,
    createServiceCard,
    createBulkServiceCards,
    updateServiceCard,
    deleteServiceCard,
} = require('../controller/serviceCard.controller');

const {
    createServiceCardRules,
    updateServiceCardRules,
    serviceCardIdParamRules,
} = require('../validations/serviceCard.validation');

const validate = require('../middlewares/validate.middleware');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Public routes
serviceCardRoutes.get('/', getAllServiceCards);

// Protected Mutation Routes (Admin Only)
serviceCardRoutes.post('/add', verifyToken, isAdmin, createServiceCardRules, validate, createServiceCard);
serviceCardRoutes.post('/bulk-add', verifyToken, isAdmin, createBulkServiceCards);
serviceCardRoutes.put('/update/:id', verifyToken, isAdmin, [...serviceCardIdParamRules, ...updateServiceCardRules], validate, updateServiceCard);
serviceCardRoutes.delete('/delete/:id', verifyToken, isAdmin, serviceCardIdParamRules, validate, deleteServiceCard);

module.exports = serviceCardRoutes;