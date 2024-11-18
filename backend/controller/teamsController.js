// controllers/teamsController.js
const { getAllTeams, createTeam, updateTeam, deleteTeam } = require('../models/teamModel');

// Get all teams
async function getAllTeamsController(req, res) {
    try {
        const teams = await getAllTeams();
        res.status(200).json(teams);
    } catch (err) {
        console.error('Error in getAllTeamsController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Create a new team
async function createTeamController(req, res) {
    const { Team_id, Team_Name, Leader_id } = req.body;
    const team = { Team_id, Team_Name, Leader_id };

    try {
        await createTeam(team);
        res.status(201).send('Team created successfully');
    } catch (err) {
        console.error('Error in createTeamController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Update team by ID
async function updateTeamController(req, res) {
    const { teamId } = req.params;
    const { Team_Name, Leader_id } = req.body;
    const team = { Team_Name, Leader_id };

    try {
        await updateTeam(teamId, team);
        res.status(200).send('Team updated successfully');
    } catch (err) {
        console.error('Error in updateTeamController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Delete team by ID
async function deleteTeamController(req, res) {
    const { teamId } = req.params;

    try {
        await deleteTeam(teamId);
        res.status(200).send('Team deleted successfully');
    } catch (err) {
        console.error('Error in deleteTeamController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getAllTeamsController, createTeamController, updateTeamController, deleteTeamController };
