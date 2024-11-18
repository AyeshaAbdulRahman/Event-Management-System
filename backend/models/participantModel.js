const oracledb = require('oracledb');

async function getAllParticipants() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Participants`);
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
}

async function createParticipant(participant) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Participants (Participant_id, Participant_Name) VALUES (:1, :2)`,
            [participant.Participant_id, participant.Participant_Name],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllParticipants, createParticipant };
