const oracledb = require('oracledb');

async function getAllClients() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Clients`);
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
}

async function createClient(client) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Clients (Client_id, User_id) VALUES (:1, :2)`,
            [client.Client_id, client.User_id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function updateClient(id, client) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE Clients SET User_id = :1 WHERE Client_id = :2`,
            [client.User_id, id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function deleteClient(id) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM Clients WHERE Client_id = :1`,
            [id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllClients, createClient, updateClient, deleteClient };

