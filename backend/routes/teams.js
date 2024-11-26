const express = require('express');
const router = express.Router();
const teamController = require('../controller/teamsController');

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeamById);
router.delete('/:id', teamController.deleteTeamById);

module.exports = router;
