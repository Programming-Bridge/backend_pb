const express = require('express');
const navbarRoutes = express.Router();

const {
    getNavItems,
    createNavItem,
    updateNavItem,
    deleteNavItem,
} = require('../controller/navbar.controller');

const {
    createNavItemRules,
    updateNavItemRules,
    mongoIdParamRules,
} = require('../validations/navbar.validation');

const validate = require('../middlewares/validate.middleware');

navbarRoutes.get('/', getNavItems);
navbarRoutes.post('/add', createNavItemRules, validate, createNavItem);
navbarRoutes.put('/update/:id', [...mongoIdParamRules, ...updateNavItemRules], validate, updateNavItem);
navbarRoutes.delete('/delete/:id', mongoIdParamRules, validate, deleteNavItem);

module.exports = navbarRoutes;