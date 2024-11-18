const oracledb = require('oracledb');

async function getAllTeams() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Teams`);
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
}

async function createTeam(team) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Teams (Team_id, Team_name) VALUES (:1, :2)`,
            [team.Team_id, team.Team_name],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function updateTeam(id, team) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE Teams SET Team_name = :1 WHERE Team_id = :2`,
            [team.Team_name, id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function deleteTeam(id) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM Teams WHERE Team_id = :1`,
            [id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllTeams, createTeam, updateTeam, deleteTeam };
