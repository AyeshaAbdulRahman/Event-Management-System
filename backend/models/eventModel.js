const oracledb = require('oracledb');

async function getAllEvents() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Events`);
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
}

async function createEvent(event) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Events (Event_id, Event_Name, Event_type, Date, Venue_id) VALUES (:1, :2, :3, :4, :5)`,
            [event.Event_id, event.Event_Name, event.Event_type, event.Date, event.Venue_id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function updateEvent(id, event) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE Events SET Event_Name = :1, Event_type = :2, Date = :3, Venue_id = :4 WHERE Event_id = :5`,
            [event.Event_Name, event.Event_type, event.Date, event.Venue_id, id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function deleteEvent(id) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM Events WHERE Event_id = :1`,
            [id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent };
