const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllParticipants() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT p.Participant_Id, p.Participant_Name, e.Event_Name
            FROM Participants p
            JOIN Events e ON p.Event_Id = e.Event_Id`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getParticipantById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT p.Participant_Id, p.Participant_Name, e.Event_Name
            FROM Participants p
            JOIN Events e ON p.Event_Id = e.Event_Id
            WHERE p.Participant_Id = ?`, [id]);
        return rows[0]; // Return specific participant details
    } finally {
        connection.release();
    }
}

async function getParticipantByName(name) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT p.Participant_Id, p.Participant_Name, e.Event_Name
            FROM Participants p
            JOIN Events e ON p.Event_Id = e.Event_Id
            WHERE p.Participant_Name = ?`, [name]);
        return rows[0]; // Return specific participant details
    } finally {
        connection.release();
    }
}

async function createParticipant(participant) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Participants (Participant_Name, Event_Id)
            SELECT ?, e.Event_Id FROM Events e WHERE e.Event_Name = ?`,
            [participant.Participant_Name, participant.Event_Name]);
        return result;
    } finally {
        connection.release();
    }
}

async function updateParticipantById(id, participant) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            UPDATE Participants p
            JOIN Events e ON p.Event_Id = e.Event_Id
            SET p.Participant_Name = ?
            WHERE p.Participant_Id = ? AND e.Event_Name = ?`,
            [participant.Participant_Name, id, participant.Event_Name]);
        return result;
    } finally {
        connection.release();
    }
}

async function deleteParticipantById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE p FROM Participants p WHERE p.Participant_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllParticipants, getParticipantById, getParticipantByName, createParticipant, updateParticipantById, deleteParticipantById };
