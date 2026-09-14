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
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Public routes
navbarRoutes.get('/', getNavItems);

// Protected Mutation Routes (Admin Only)
navbarRoutes.post('/add', verifyToken, isAdmin, createNavItemRules, validate, createNavItem);
navbarRoutes.put('/update/:id', verifyToken, isAdmin, [...mongoIdParamRules, ...updateNavItemRules], validate, updateNavItem);
navbarRoutes.delete('/delete/:id', verifyToken, isAdmin, mongoIdParamRules, validate, deleteNavItem);

module.exports = navbarRoutes;