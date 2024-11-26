const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllClients() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT c.Client_Id, u.Email, u.First_Name, u.Last_Name
            FROM Clients c
            JOIN Users u ON c.User_Id = u.User_Id`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getClientById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT c.Client_Id, u.Email, u.First_Name, u.Last_Name
            FROM Clients c
            JOIN Users u ON c.User_Id = u.User_Id
            WHERE c.Client_Id = ?`, [id]);
        return rows[0]; // Return single row for specific client
    } finally {
        connection.release();
    }
}

async function getClientByEmail(email) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT c.Client_Id, u.Email, u.First_Name, u.Last_Name
            FROM Clients c
            JOIN Users u ON c.User_Id = u.User_Id
            WHERE u.Email = ?`, [email]);
        return rows[0]; // Return single row for specific client
    } finally {
        connection.release();
    }
}

async function createClient(client) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Clients (User_Id)
            SELECT User_Id FROM Users WHERE Email = ?`, [client.email]);
        return result;
    } finally {
        connection.release();
    }
}

async function updateClientById(id, client) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            UPDATE Clients c
            JOIN Users u ON c.User_Id = u.User_Id
            SET u.First_Name = ?, u.Last_Name = ?
            WHERE c.Client_Id = ?`, [client.firstName, client.lastName, id]);
        return result;
    } finally {
        connection.release();
    }
}

async function deleteClientById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE c, u
            FROM Clients c
            JOIN Users u ON c.User_Id = u.User_Id
            WHERE c.Client_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllClients, getClientById, getClientByEmail, createClient, updateClientById, deleteClientById };

