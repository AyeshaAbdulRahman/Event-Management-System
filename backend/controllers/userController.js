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

async function updateUserProfile(req, res) {
    try {
        const { userId, firstName, lastName, email, oldPassword, newPassword } = req.body;
        const connection = await pool.getConnection();

        try {
            // First verify the old password
            const [users] = await connection.execute(
                'SELECT * FROM users WHERE User_Id = ? AND Password = ?',
                [userId, oldPassword]
            );

            if (users.length === 0) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            // Update user information
            const updateQuery = newPassword 
                ? 'UPDATE users SET First_Name = ?, Last_Name = ?, Email = ?, Password = ? WHERE User_Id = ?'
                : 'UPDATE users SET First_Name = ?, Last_Name = ?, Email = ? WHERE User_Id = ?';
            
            const updateParams = newPassword 
                ? [firstName, lastName, email, newPassword, userId]
                : [firstName, lastName, email, userId];

            const [result] = await connection.execute(updateQuery, updateParams);

            if (result.affectedRows > 0) {
                res.json({ message: 'Profile updated successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile
}; 