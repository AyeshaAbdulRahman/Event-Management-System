const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllRegistrations() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT r.Registration_Id, p.Participant_Name, pa.Amount
            FROM Registrations r
            JOIN Participants p ON r.Participant_Id = p.Participant_Id
            JOIN Payments pa ON r.Payment_Id = pa.Payment_Id`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getRegistrationById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT r.Registration_Id, p.Participant_Name, pa.Amount
            FROM Registrations r
            JOIN Participants p ON r.Participant_Id = p.Participant_Id
            JOIN Payments pa ON r.Payment_Id = pa.Payment_Id
            WHERE r.Registration_Id = ?`, [id]);
        return rows[0];
    } finally {
        connection.release();
    }
}

async function createRegistration(registration) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Registrations (Participant_Id, Payment_Id)
            VALUES (?, ?)`,
            [registration.Participant_Id, registration.Payment_Id]);
        return result;
    } finally {
        connection.release();
    }
}

async function deleteRegistrationById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE FROM Registrations WHERE Registration_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllRegistrations, getRegistrationById, createRegistration, deleteRegistrationById };

