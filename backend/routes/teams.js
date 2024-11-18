// routes/teams.js
const express = require('express');
const router = express.Router();
const { getAllTeamsController, createTeamController, updateTeamController, deleteTeamController } = require('../controller/teamsController');

// Routes for teams
router.get('/', getAllTeamsController);  // Get all teams
router.post('/', createTeamController);  // Create a new team
router.put('/:teamId', updateTeamController);  // Update team by ID
router.delete('/:teamId', deleteTeamController);  // Delete team by ID

module.exports = router;
