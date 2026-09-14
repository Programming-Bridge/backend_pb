const express = require('express');
const teamRoutes = express.Router();

const {
    getAllTeamMembers,
    getTeamMemberById,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    seedTeam,
} = require('../controller/team.controller');

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Public routes
teamRoutes.get('/', getAllTeamMembers);
teamRoutes.get('/:id', getTeamMemberById);

// Protected Mutation Routes (Admin Only)
teamRoutes.post('/', verifyToken, isAdmin, createTeamMember);
teamRoutes.post('/add', verifyToken, isAdmin, createTeamMember);
teamRoutes.post('/seed', verifyToken, isAdmin, seedTeam);
teamRoutes.put('/:id', verifyToken, isAdmin, updateTeamMember);
teamRoutes.patch('/:id', verifyToken, isAdmin, updateTeamMember);
teamRoutes.delete('/:id', verifyToken, isAdmin, deleteTeamMember);

module.exports = teamRoutes;
