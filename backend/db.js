// config/db.js
const oracledb = require('oracledb');
require('dotenv').config();

async function initialize() {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        });
        console.log("Oracle DB connection established.");
    } catch (err) {
        console.error("Error connecting to Oracle DB: ", err);
        throw err;
    }
} 

async function close() {
    try {
        await oracledb.getPool().close(10);
        console.log("Oracle DB connection closed.");
    } catch (err) {
        console.error("Error closing Oracle DB connection: ", err);
        throw err;
    }
}

module.exports = { initialize, close };
