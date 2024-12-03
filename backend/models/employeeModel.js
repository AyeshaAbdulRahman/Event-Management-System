const { pool } = require('../db');

async function getEmployeeTeam(userId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT t.Team_Id, t.Team_Name 
            FROM employees e
            JOIN teams t ON e.Team_Id = t.Team_Id
            WHERE e.User_Id = ?
        `, [userId]);
        return rows[0];
    } finally {
        connection.release();
    }
}

async function getTeamMembers(teamId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT 
                e.Employee_Id,
                u.First_Name,
                u.Last_Name,
                u.Email,
                t.Team_Name
            FROM employees e
            JOIN users u ON e.User_Id = u.User_Id
            JOIN teams t ON e.Team_Id = t.Team_Id
            WHERE e.Team_Id = ?
        `, [teamId]);
        return rows;
    } finally {
        connection.release();
    }
}

module.exports = {
    getEmployeeTeam,
    getTeamMembers
}; 