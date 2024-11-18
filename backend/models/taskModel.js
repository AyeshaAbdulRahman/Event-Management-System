const oracledb = require('oracledb');

async function getAllTasks() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Tasks`);
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
}

async function createTask(task) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Tasks (Task_id, Task_name, Team_id, Due_date) VALUES (:1, :2, :3, :4)`,
            [task.Task_id, task.Task_name, task.Team_id, task.Due_date],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function updateTask(id, task) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE Tasks SET Task_name = :1, Team_id = :2, Due_date = :3 WHERE Task_id = :4`,
            [task.Task_name, task.Team_id, task.Due_date, id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function deleteTask(id) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM Tasks WHERE Task_id = :1`,
            [id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
