const mysql = require("mysql2/promise");

let pool;

// Initialize database connection pool
async function initialize() {
    try {
        pool = await mysql.createPool({
            host: "localhost", // Replace with your MySQL server host
            user: "root",      // Replace with your MySQL username
            password: "",      // Replace with your MySQL password
            database: "EventManagement", // Replace with your MySQL database name
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        console.log("MySQL DB connection established.");
    } catch (err) {
        console.error("Error connecting to MySQL DB: ", err);
        throw err;
    }
}  
async function createDatabase() {
    const dbName = "EventManagement";
    const sqlScript = `CREATE DATABASE IF NOT EXISTS ${dbName};`;

    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root", // Replace with your MySQL username
            password: ""  // Replace with your MySQL password
        });
        await connection.query(sqlScript);
        console.log(`Database "${dbName}" created or already exists.`);
        connection.close(); // Close the connection to the MySQL server
    } catch (err) {
        console.error("Error creating database: ", err);
        throw err;
    }
}
// Close database connection pool
async function close() {
    try {
        if (pool) {
            await pool.end();
            console.log("MySQL DB connection closed.");
        }
    } catch (err) {
        console.error("Error closing MySQL DB connection: ", err);
        throw err;
    }
}

// Get database connection pool
function getPool() {
    if (!pool) {
        throw new Error("Database connection is not initialized. Call initialize() first.");
    }
    return pool;
}

// Create database if it doesn't exist
async function createTables() {
    const sqlScript = `
CREATE TABLE IF NOT EXISTS Users (
    User_Id INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Password VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Teams (
    Team_Id INT AUTO_INCREMENT PRIMARY KEY,
    Team_Name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Clients (
    Client_Id INT AUTO_INCREMENT PRIMARY KEY,
    User_Id INT NOT NULL,
    FOREIGN KEY (User_Id) REFERENCES Users(User_Id)
);

CREATE TABLE IF NOT EXISTS Employees (
    Employee_Id INT AUTO_INCREMENT PRIMARY KEY,
    User_Id INT NOT NULL,
    Team_Id INT NOT NULL,
    FOREIGN KEY (User_Id) REFERENCES Users(User_Id),
    FOREIGN KEY (Team_Id) REFERENCES Teams(Team_Id)
);

CREATE TABLE IF NOT EXISTS Admins (
    Admin_Id INT AUTO_INCREMENT PRIMARY KEY,
    User_Id INT NOT NULL,
    Admin_Level VARCHAR(50) DEFAULT 'standard' NOT NULL,
    FOREIGN KEY (User_Id) REFERENCES Users(User_Id)
);

CREATE TABLE IF NOT EXISTS Venues (
    Venue_Id INT AUTO_INCREMENT PRIMARY KEY,
    Venue_Name VARCHAR(200) NOT NULL,
    City VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Events (
    Event_Id INT AUTO_INCREMENT PRIMARY KEY,
    Event_Name VARCHAR(50) NOT NULL,
    Event_Type VARCHAR(50) NOT NULL,
    Date DATE NOT NULL,
    Client_Id INT NOT NULL,
    Venue_Id INT NOT NULL,
    FOREIGN KEY (Client_Id) REFERENCES Clients(Client_Id),
    FOREIGN KEY (Venue_Id) REFERENCES Venues(Venue_Id)
);

CREATE TABLE IF NOT EXISTS Vendors (
    Vendor_Id INT AUTO_INCREMENT PRIMARY KEY,
    Vendor_Name VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS Supplies (
    Vendor_Id INT NOT NULL,
    Event_Id INT NOT NULL,
    Item_Name VARCHAR(200) NOT NULL,
    PRIMARY KEY (Vendor_Id, Event_Id, Item_Name),
    FOREIGN KEY (Vendor_Id) REFERENCES Vendors(Vendor_Id),
    FOREIGN KEY (Event_Id) REFERENCES Events(Event_Id)
);

CREATE TABLE IF NOT EXISTS Tasks (
    Task_Id INT AUTO_INCREMENT PRIMARY KEY,
    Task_Name VARCHAR(200) NOT NULL,
    Due_Date DATE NOT NULL,
    Event_Id INT NOT NULL,
    Team_Id INT NOT NULL,
    FOREIGN KEY (Event_Id) REFERENCES Events(Event_Id),
    FOREIGN KEY (Team_Id) REFERENCES Teams(Team_Id)
);

CREATE TABLE IF NOT EXISTS Participants (
    Participant_Id INT AUTO_INCREMENT PRIMARY KEY,
    Participant_Name VARCHAR(200) NOT NULL,
    Event_Id INT NOT NULL,
    FOREIGN KEY (Event_Id) REFERENCES Events(Event_Id)
);

CREATE TABLE IF NOT EXISTS Payments (
    Payment_Id INT AUTO_INCREMENT PRIMARY KEY,
    Participant_Id INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Participant_Id) REFERENCES Participants(Participant_Id)
);

CREATE TABLE IF NOT EXISTS Registrations (
    Registration_Id INT AUTO_INCREMENT PRIMARY KEY,
    Participant_Id INT NOT NULL,
    Payment_Id INT NOT NULL,
    FOREIGN KEY (Participant_Id) REFERENCES Participants(Participant_Id),
    FOREIGN KEY (Payment_Id) REFERENCES Payments(Payment_Id)
);
`;

    // Split the SQL script into individual statements
    const statements = sqlScript.split(';').map(s => s.trim()).filter(s => s.length > 0); // Trim and remove empty statements

    try {
        const pool = getPool();
        const connection = await pool.getConnection();

        // Execute each SQL statement
        for (const statement of statements) {
            await connection.query(statement + ';');
        }

        //console.log("Tables created successfully.");
        connection.release();
    } catch (err) {
        console.error("Error creating tables: ", err);
        throw err;
    }
}


// Main function to run the script
async function main() {
    try {
        await createDatabase(); // Create the database if not exists
        await initialize(); // Initialize the connection pool
        await createTables(); // Create all required tables
    } catch (err) {
        console.error(err);
    } finally {
        await close(); // Close the database connection
    }
}

main();

