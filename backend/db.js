const mysql = require('mysql2/promise');

let pool;

async function createPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}

// Initialize pool immediately
createPool().then(() => {
    console.log('Database pool created successfully');
}).catch(err => {
    console.error('Failed to create database pool:', err);
});

async function initializeDatabase() {
    try {
        if (!pool) {
            await createPool();
        }
        
        const connection = await pool.getConnection();
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS users (
                    User_Id INT AUTO_INCREMENT PRIMARY KEY,
                    First_Name VARCHAR(100) NOT NULL,
                    Last_Name VARCHAR(100) NOT NULL,
                    Email VARCHAR(100) NOT NULL UNIQUE,
                    Role VARCHAR(50) NOT NULL,
                    Password VARCHAR(20) NOT NULL
                )
            `);
            console.log('Database initialized successfully');
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

async function registerUser(firstName, lastName, email, role, password) {
    if (!pool) {
        await createPool();
    }

    const connection = await pool.getConnection();
    try {
        // Store password directly without hashing
        const [result] = await connection.execute(
            'INSERT INTO users (First_Name, Last_Name, Email, Role, Password) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, role, password]
        );
        return { success: true, userId: result.insertId };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Email already exists');
        }
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    createPool,
    initializeDatabase,
    registerUser,
    pool,
    getPool: () => pool
};

