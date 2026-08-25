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

serviceCardRoutes.get('/', getAllServiceCards);
serviceCardRoutes.post('/add', createServiceCardRules, validate, createServiceCard);
serviceCardRoutes.post('/bulk-add', createBulkServiceCards);
serviceCardRoutes.put('/update/:id', [...serviceCardIdParamRules, ...updateServiceCardRules], validate, updateServiceCard);
serviceCardRoutes.delete('/delete/:id', serviceCardIdParamRules, validate, deleteServiceCard);

module.exports = serviceCardRoutes;