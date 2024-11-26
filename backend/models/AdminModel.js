const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllAdmins() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT a.Admin_Id, u.Email, u.First_Name, u.Last_Name, a.Admin_Level
            FROM Admins a
            JOIN Users u ON a.User_Id = u.User_Id`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getAdminById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT a.Admin_Id, u.Email, u.First_Name, u.Last_Name, a.Admin_Level
            FROM Admins a
            JOIN Users u ON a.User_Id = u.User_Id
            WHERE a.Admin_Id = ?`, [id]);
        return rows[0]; // Return specific admin details
    } finally {
        connection.release();
    }
}

async function getAdminByEmail(email) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT a.Admin_Id, u.Email, u.First_Name, u.Last_Name, a.Admin_Level
            FROM Admins a
            JOIN Users u ON a.User_Id = u.User_Id
            WHERE u.Email = ?`, [email]);
        return rows[0]; // Return specific admin details
    } finally {
        connection.release();
    }
}

async function createAdmin(admin) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Admins (User_Id, Admin_Level)
            SELECT User_Id, ? FROM Users WHERE Email = ?`, [admin.Admin_Level, admin.email]);
        return result;
    } finally {
        connection.release();
    }
}

async function updateAdminById(id, admin) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            UPDATE Admins a
            JOIN Users u ON a.User_Id = u.User_Id
            SET a.Admin_Level = ?
            WHERE a.Admin_Id = ?`, [admin.Admin_Level, id]);
        return result;
    } finally {
        connection.release();
    }
}

async function deleteAdminById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE a, u
            FROM Admins a
            JOIN Users u ON a.User_Id = u.User_Id
            WHERE a.Admin_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllAdmins, getAdminById, getAdminByEmail, createAdmin, updateAdminById, deleteAdminById };

