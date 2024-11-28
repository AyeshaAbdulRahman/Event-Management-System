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
            // Create users table
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

            // Create clients table
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS clients (
                    Client_Id INT AUTO_INCREMENT PRIMARY KEY,
                    User_Id INT,
                    FOREIGN KEY (User_Id) REFERENCES users(User_Id)
                )
            `);

            // Create teams table (if it doesn't exist already)
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS teams (
                    Team_Id INT AUTO_INCREMENT PRIMARY KEY,
                    Team_Name VARCHAR(100) NOT NULL
                )
            `);

            // Create employees table
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS employees (
                    Employee_Id INT AUTO_INCREMENT PRIMARY KEY,
                    User_Id INT,
                    Team_Id INT,
                    FOREIGN KEY (User_Id) REFERENCES users(User_Id),
                    FOREIGN KEY (Team_Id) REFERENCES teams(Team_Id)
                )
            `);

            // Create venues table
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS venues (
                    Venue_Id INT AUTO_INCREMENT PRIMARY KEY,
                    Venue_Name VARCHAR(200) NOT NULL,
                    City VARCHAR(100) NOT NULL
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
        await connection.beginTransaction();

        // Insert into users table
        const [userResult] = await connection.execute(
            'INSERT INTO users (First_Name, Last_Name, Email, Role, Password) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, role, password]
        );
        const userId = userResult.insertId;

        // Based on role, insert into respective table
        if (role === 'client') {
            await connection.execute(
                'INSERT INTO clients (User_Id) VALUES (?)',
                [userId]
            );
        } else if (role === 'employee') {
            // Get a random team_id from teams table
            const [teams] = await connection.execute('SELECT Team_Id FROM teams');
            if (teams.length === 0) {
                throw new Error('No teams available for employee assignment');
            }
            const randomTeam = teams[Math.floor(Math.random() * teams.length)];
            
            await connection.execute(
                'INSERT INTO employees (User_Id, Team_Id) VALUES (?, ?)',
                [userId, randomTeam.Team_Id]
            );
        }

        await connection.commit();
        return { success: true, userId };
    } catch (error) {
        await connection.rollback();
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

