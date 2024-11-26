const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllTasks() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT t.Task_Id, t.Task_Name, t.Due_Date, e.Event_Name, tm.Team_Name
            FROM Tasks t
            JOIN Events e ON t.Event_Id = e.Event_Id
            JOIN Teams tm ON t.Team_Id = tm.Team_Id`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getTaskById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT t.Task_Id, t.Task_Name, t.Due_Date, e.Event_Name, tm.Team_Name
            FROM Tasks t
            JOIN Events e ON t.Event_Id = e.Event_Id
            JOIN Teams tm ON t.Team_Id = tm.Team_Id
            WHERE t.Task_Id = ?`, [id]);
        return rows[0];
    } finally {
        connection.release();
    }
}

async function createTask(task) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Tasks (Task_Name, Due_Date, Event_Id, Team_Id)
            VALUES (?, ?, (SELECT Event_Id FROM Events WHERE Event_Name = ?), (SELECT Team_Id FROM Teams WHERE Team_Name = ?))`,
            [task.Task_Name, task.Due_Date, task.Event_Name, task.Team_Name]);
        return result;
    } finally {
        connection.release();
    }
}

async function deleteTaskById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE FROM Tasks WHERE Task_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllTasks, getTaskById, createTask, deleteTaskById };
