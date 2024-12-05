const Employee = require('../models/employeeModel');
const { pool } = require('../db');

async function getEmployeeTeam(req, res) {
    try {
        const userId = req.params.userId;
        const team = await Employee.getEmployeeTeam(userId);
        
        if (team) {
            res.json({ teamName: team.Team_Name });
        } else {
            res.status(404).json({ message: 'Team not found for this employee' });
        }
    } catch (error) {
        console.error('Error fetching employee team:', error);
        res.status(500).json({ message: 'Error fetching team information' });
    }
}

async function getTeamMembers(req, res) {
    try {
        const userId = req.params.userId;
        const team = await Employee.getEmployeeTeam(userId);
        
        if (team) {
            const members = await Employee.getTeamMembers(team.Team_Id);
            res.json({ 
                teamName: team.Team_Name,
                members: members 
            });
        } else {
            res.status(404).json({ message: 'Team not found for this employee' });
        }
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ message: 'Error fetching team information' });
    }
}

async function getEmployeeInfo(req, res) {
    try {
        const userId = req.params.userId;
        const connection = await pool.getConnection();
        
        try {
            // First check if user exists and get their info
            const [users] = await connection.execute(`
                SELECT 
                    u.User_Id,
                    u.First_Name,
                    u.Last_Name,
                    u.Email,
                    t.Team_Name
                FROM users u
                JOIN employees e ON u.User_Id = e.User_Id
                JOIN teams t ON e.Team_Id = t.Team_Id
                WHERE u.User_Id = ?
            `, [userId]);

            if (users.length === 0) {
                return res.status(404).json({ 
                    message: 'Employee not found',
                    error: 'No matching user found'
                });
            }

            // Add some debug logging
            console.log('Found employee:', users[0]);

            res.json({
                First_Name: users[0].First_Name,
                Last_Name: users[0].Last_Name,
                Email: users[0].Email,
                Team_Name: users[0].Team_Name
            });

        } catch (dbError) {
            console.error('Database error:', dbError);
            throw dbError;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in getEmployeeInfo:', error);
        res.status(500).json({ 
            message: 'Error fetching employee information',
            error: error.message 
        });
    }
}

module.exports = {
    getEmployeeTeam,
    getTeamMembers,
    getEmployeeInfo
}; 