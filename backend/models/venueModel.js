const oracledb = require('oracledb');

async function getAllVenues() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Venues`);
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
}

async function createVenue(venue) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Venues (Venue_id, Venue_name, City) VALUES (:1, :2, :3)`,
            [venue.Venue_id, venue.Venue_name, venue.City],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function updateVenue(id, venue) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE Venues SET Venue_name = :1, City = :2 WHERE Venue_id = :3`,
            [venue.Venue_name, venue.City, id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function deleteVenue(id) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM Venues WHERE Venue_id = :1`,
            [id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllVenues, createVenue, updateVenue, deleteVenue };
