const Task = require('../models/taskModel');
const { pool } = require('../db');

async function getEmployeeTeamTasks(req, res) {
    try {
        const userId = req.params.userId;
        const connection = await pool.getConnection();
        
        try {
            // First get employee's team
            const [teams] = await connection.execute(`
                SELECT Team_Id FROM employees WHERE User_Id = ?
            `, [userId]);

            if (teams.length === 0) {
                return res.status(404).json({ message: 'Employee team not found' });
            }

            const teamId = teams[0].Team_Id;
            const tasks = await Task.getTasksByTeam(teamId);
            res.json(tasks);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching team tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}

async function getEventTasks(req, res) {
    try {
        const eventId = req.params.eventId;
        const tasks = await Task.getEventTasks(eventId);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching event tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}

module.exports = {
    getEmployeeTeamTasks,
    getEventTasks
}; 