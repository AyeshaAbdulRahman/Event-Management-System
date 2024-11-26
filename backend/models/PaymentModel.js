const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllPayments() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT p.Payment_Id, p.Amount, pt.Participant_Name
            FROM Payments p
            JOIN Participants pt ON p.Participant_Id = pt.Participant_Id`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getPaymentById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT p.Payment_Id, p.Amount, pt.Participant_Name
            FROM Payments p
            JOIN Participants pt ON p.Participant_Id = pt.Participant_Id
            WHERE p.Payment_Id = ?`, [id]);
        return rows[0]; // Return specific payment details
    } finally {
        connection.release();
    }
}

async function createPayment(payment) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Payments (Amount, Participant_Id)
            SELECT ?, pt.Participant_Id FROM Participants pt WHERE pt.Participant_Name = ?`,
            [payment.Amount, payment.Participant_Name]);
        return result;
    } finally {
        connection.release();
    }
}

async function updatePaymentById(id, payment) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            UPDATE Payments p
            JOIN Participants pt ON p.Participant_Id = pt.Participant_Id
            SET p.Amount = ?
            WHERE p.Payment_Id = ? AND pt.Participant_Name = ?`,
            [payment.Amount, id, payment.Participant_Name]);
        return result;
    } finally {
        connection.release();
    }
}

async function deletePaymentById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE p FROM Payments p WHERE p.Payment_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllPayments, getPaymentById, createPayment, updatePaymentById, deletePaymentById };

