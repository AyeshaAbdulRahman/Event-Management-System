const { pool } = require('../db');

async function getNextParticipantId() {
    const connection = await pool.getConnection();
    try {
        // Get the maximum participant ID currently in use
        const [rows] = await connection.execute('SELECT MAX(Participant_Id) as maxId FROM participants');
        const maxId = rows[0].maxId || 0;
        return maxId + 1; // Return next available ID
    } finally {
        connection.release();
    }
}

async function createParticipant(participantName, eventId) {
    const connection = await pool.getConnection();
    try {
        // Validate eventId is a number
        if (!eventId || isNaN(parseInt(eventId))) {
            throw new Error('Invalid Event ID');
        }

        const nextId = await getNextParticipantId();
        
        const [result] = await connection.execute(
            'INSERT INTO participants (Participant_Id, Participant_Name, Event_Id) VALUES (?, ?, ?)',
            [nextId, participantName, parseInt(eventId)]
        );
        return { ...result, insertId: nextId };
    } finally {
        connection.release();
    }
}

async function getParticipantsByEvent(eventId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM participants WHERE Event_Id = ?',
            [eventId]
        );
        return rows;
    } finally {
        connection.release();
    }
}

async function getAllParticipants() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT 
                p.Participant_Id,
                p.Participant_Name,
                e.Event_Name,
                e.Date as Event_Date
            FROM participants p
            JOIN events e ON p.Event_Id = e.Event_Id
            ORDER BY p.Participant_Id DESC
        `);
        return rows;
    } finally {
        connection.release();
    }
}

module.exports = {
    createParticipant,
    getParticipantsByEvent,
    getAllParticipants
};
