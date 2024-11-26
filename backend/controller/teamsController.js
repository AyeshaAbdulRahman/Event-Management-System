const teamModel = require('../models/teamModel');

// Get all teams
async function getAllTeams(req, res) {
    try {
        const teams = await teamModel.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error: error.message });
    }
}

async function getTeamById(req, res) {
    const { id } = req.params;
    try {
        const team = await teamModel.getTeamById(id);
        if (team) {
            res.status(200).json(team);
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team', error: error.message });
    }
}
async function createTeam(req, res) {
    const { name, leaderId } = req.body;
    try {
        const result = await teamModel.createTeam({ name, leaderId });
        res.status(201).json({ message: 'Team created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating team', error: error.message });
    }
}

async function updateTeamById(req, res) {
    const { id } = req.params;
    const { name, leaderId } = req.body;
    try {
        const result = await teamModel.updateTeamById(id, { name, leaderId });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Team updated successfully' });
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating team', error: error.message });
    }
}

async function deleteTeamById(req, res) {
    const { id } = req.params;
    try {
        const result = await teamModel.deleteTeamById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Team deleted successfully' });
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team', error: error.message });
    }
}

module.exports = {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeamById,
    deleteTeamById
};
