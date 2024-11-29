const { pool } = require('../db');

async function getAllVenues(req, res) {
    try {
        const connection = await pool.getConnection();
        try {
            const [venues] = await connection.execute(
                'SELECT Venue_Id, Venue_Name, City FROM venues'
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

async function createVenue(req, res) {
    try {
        const { venueName, city } = req.body;
        
        if (!venueName || !city) {
            return res.status(400).json({ message: 'Venue name and city are required' });
        }

        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO venues (Venue_Name, City) VALUES (?, ?)',
                [venueName, city]
            );

            res.status(201).json({ 
                message: 'Venue registered successfully',
                venueId: result.insertId,
                venueName,
                city
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating venue:', error);
        res.status(500).json({ message: 'Error creating venue' });
    }
}

module.exports = {
    getAllVenues,
    createVenue
}; 