const express = require('express');
const authRoutes = express.Router();

const {
    login,
    register,
    getMe,
    changePassword,
    initAdmin,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} = require('../controller/auth.controller');

const {
    loginRules,
    registerRules,
    changePasswordRules,
} = require('../validations/auth.validation');

const { verifyToken, isAdmin, isSuperAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// Public Auth Endpoints
authRoutes.post('/login', loginRules, validate, login);
authRoutes.post('/init', initAdmin);

// Protected Auth Endpoints
authRoutes.get('/me', verifyToken, getMe);
authRoutes.post('/register', verifyToken, isAdmin, registerRules, validate, register);
authRoutes.put('/change-password', verifyToken, changePasswordRules, validate, changePassword);

// Superadmin User Management Endpoints
authRoutes.get('/users', verifyToken, isSuperAdmin, getAllUsers);
authRoutes.post('/users', verifyToken, isSuperAdmin, createUser);
authRoutes.put('/users/:id', verifyToken, isSuperAdmin, updateUser);
authRoutes.delete('/users/:id', verifyToken, isSuperAdmin, deleteUser);

module.exports = authRoutes;
