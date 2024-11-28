const { pool } = require('../db');

async function getUserProfile(req, res) {
    try {
        const userId = req.params.userId;
        const connection = await pool.getConnection();
        try {
            const [users] = await connection.execute(`
                SELECT 
                    u.User_Id,
                    u.First_Name,
                    u.Last_Name,
                    u.Email,
                    u.Role,
                    c.Client_Id
                FROM users u
                LEFT JOIN clients c ON u.User_Id = c.User_Id
                WHERE u.User_Id = ?
            `, [userId]);

            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(users[0]);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
}

module.exports = {
    getUserProfile
}; 