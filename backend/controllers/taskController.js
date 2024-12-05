const Task = require('../models/taskModel');
const { pool } = require('../db');

async function getEmployeeTeamTasks(req, res) {
    try {
        const userId = req.params.userId;
        const connection = await pool.getConnection();
        
        try {
            // First get employee's team
            const [teams] = await connection.execute(`
                SELECT t.Team_Id, t.Team_Name 
                FROM employees e
                JOIN teams t ON e.Team_Id = t.Team_Id
                WHERE e.User_Id = ?
            `, [userId]);

            if (teams.length === 0) {
                return res.status(404).json({ message: 'Employee team not found' });
            }

            const teamId = teams[0].Team_Id;
            
            // Get all tasks for this team
            const [tasks] = await connection.execute(`
                SELECT 
                    t.Task_Id,
                    t.Task_Name,
                    e.Event_Name,
                    tm.Team_Name
                FROM tasks t
                JOIN events e ON t.Event_Id = e.Event_Id
                JOIN teams tm ON t.Team_Id = tm.Team_Id
                WHERE t.Team_Id = ?
                ORDER BY e.Date DESC
            `, [teamId]);

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