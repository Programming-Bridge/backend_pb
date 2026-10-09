const express = require('express');
const visitorRoutes = express.Router();
const {
    trackVisitor,
    getAllVisitors,
    getVisitorById,
    deleteVisitor,
    clearAllVisitors,
} = require('../controller/visitor.controller');
const { verifyToken, isAdmin, isSuperAdmin } = require('../middlewares/auth.middleware');

// Public tracking endpoint (fire & forget from frontend)
visitorRoutes.post('/track', trackVisitor);

// Admin-only management endpoints
visitorRoutes.get('/', verifyToken, isAdmin, getAllVisitors);
visitorRoutes.get('/:id', verifyToken, isAdmin, getVisitorById);
visitorRoutes.delete('/:id', verifyToken, isAdmin, deleteVisitor);
visitorRoutes.delete('/', verifyToken, isSuperAdmin, clearAllVisitors);

module.exports = visitorRoutes;
