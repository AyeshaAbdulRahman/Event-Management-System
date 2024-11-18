const oracledb = require('oracledb');

async function getAllRegistrations() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Registrations`);
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
}

async function createRegistration(registration) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Registrations (Registration_id, Participant_id, Event_id) VALUES (:1, :2, :3)`,
            [registration.Registration_id, registration.Participant_id, registration.Event_id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function updateRegistration(id, registration) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE Registrations SET Participant_id = :1, Event_id = :2 WHERE Registration_id = :3`,
            [registration.Participant_id, registration.Event_id, id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function deleteRegistration(id) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM Registrations WHERE Registration_id = :1`,
            [id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllRegistrations, createRegistration, updateRegistration, deleteRegistration };

