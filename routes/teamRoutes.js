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

teamRoutes.get('/', getAllTeamMembers);
teamRoutes.get('/:id', getTeamMemberById);
teamRoutes.post('/', createTeamMember);
teamRoutes.post('/add', createTeamMember);
teamRoutes.post('/seed', seedTeam);
teamRoutes.put('/:id', updateTeamMember);
teamRoutes.patch('/:id', updateTeamMember);
teamRoutes.delete('/:id', deleteTeamMember);

module.exports = teamRoutes;
