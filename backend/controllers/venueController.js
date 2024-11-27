const { pool } = require('../db');

async function getAllVenues(req, res) {
    try {
        const connection = await pool.getConnection();
        try {
            const [venues] = await connection.execute(
                'SELECT Venue_Id, Venue_Name, City as Venue_City FROM venues'
            );
            res.json(venues);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching venues:', error);
        res.status(500).json({ message: 'Error fetching venues' });
    }
}

module.exports = {
    getAllVenues
}; 