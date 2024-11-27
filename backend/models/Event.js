const pool = require('../db');

class Event {
    static async getAllEvents() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM events ORDER BY date DESC'
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    static async createEvent(eventData) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO events (title, date, type, description, status) VALUES (?, ?, ?, ?, ?)',
                [eventData.title, eventData.date, eventData.type, eventData.description, eventData.status]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    static async getEventById(id) {
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