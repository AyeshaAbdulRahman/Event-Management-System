const { pool } = require('./db');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    try {
        const triggersSQL = await fs.readFile(path.join(__dirname, 'triggers.sql'), 'utf8');
        const viewsSQL = await fs.readFile(path.join(__dirname, 'views.sql'), 'utf8');
        const proceduresSQL = await fs.readFile(path.join(__dirname, 'procedures.sql'), 'utf8');
        const connection = await pool.getConnection();
        
        try {
            await connection.query(triggersSQL);
            await connection.query(viewsSQL);
            await connection.query(proceduresSQL);
            console.log('Database objects initialized successfully');
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error initializing database objects:', error);
    }
}

module.exports = { initializeDatabase }; 