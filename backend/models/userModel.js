const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllUsers() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT User_Id, First_Name, Last_Name, Email, Role FROM Users`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getUserById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT User_Id, First_Name, Last_Name, Email, Role FROM Users WHERE User_Id = ?`, [id]);
        return rows[0];
    } finally {
        connection.release();
    }
}

async function createUser(user) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Users (First_Name, Last_Name, Email, Role, Password)
            VALUES (?, ?, ?, ?, ?)`,
            [user.First_Name, user.Last_Name, user.Email, user.Role, user.Password]);
        return result;
    } finally {
        connection.release();
    }
}

async function deleteUserById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE FROM Users WHERE User_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllUsers, getUserById, createUser, deleteUserById };
