const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllTeams() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT Team_Id, Team_Name FROM Teams`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getTeamById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT Team_Id, Team_Name FROM Teams WHERE Team_Id = ?`, [id]);
        return rows[0];
    } finally {
        connection.release();
    }
}

async function createTeam(team) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Teams (Team_Name) VALUES (?)`,
            [team.Team_Name]);
        return result;
    } finally {
        connection.release();
    }
}

async function deleteTeamById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE FROM Teams WHERE Team_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllTeams, getTeamById, createTeam, deleteTeamById };

