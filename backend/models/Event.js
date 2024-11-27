const db = require('../db');

class Event {
    static async getAllEvents() {
        const pool = db.getPool();
        if (!pool) {
            throw new Error('Database pool not initialized');
        }

        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM events ORDER BY Date DESC'
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    static async createEvent(eventData) {
        const pool = db.getPool();
        if (!pool) {
            throw new Error('Database pool not initialized');
        }

        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO events (Event_Name, Event_Type, Date) VALUES (?, ?, ?)',
                [eventData.eventName, eventData.eventType, eventData.eventDate]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    static async getEventById(id) {
        const pool = db.getPool();
        if (!pool) {
            throw new Error('Database pool not initialized');
        }

        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM events WHERE id = ?',
                [id]
            );
            return rows[0];
        } finally {
            connection.release();
        }
    }

    static async updateEventStatus(id, status) {
        const pool = db.getPool();
        if (!pool) {
            throw new Error('Database pool not initialized');
        }

        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'UPDATE events SET status = ? WHERE id = ?',
                [status, id]
            );
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }
}

module.exports = Event; 