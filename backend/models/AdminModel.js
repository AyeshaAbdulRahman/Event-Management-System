const oracledb = require('oracledb');

// Get all admins
async function getAllAdmins() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Admins`);
        return result.rows;
    } catch (err) {
        console.error("Error in getAllAdmins: ", err);
    } finally {
        if (connection) await connection.close();
    }
}

// Create a new admin
async function createAdmin(admin) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Admins (Admin_id, Admin_Name, Role) VALUES (:1, :2, :3)`,
            [admin.Admin_id, admin.Admin_Name, admin.Role],
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error("Error in createAdmin: ", err);
    } finally {
        if (connection) await connection.close();
    }
}

// Update admin by ID
async function updateAdmin(adminId, admin) {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Execute the update query
        const result = await connection.execute(
            `UPDATE Admins SET Admin_Name = :1, Role = :2 WHERE Admin_id = :3`,
            [admin.Admin_Name, admin.Role, adminId],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            throw new Error('Admin not found with the given ID.');
        }

        return result;
    } catch (err) {
        console.error("Error in updateAdmin: ", err.message || err);
        throw err;  // Propagate the error
    } finally {
        if (connection) await connection.close();
    }
}

// Delete admin by ID
async function deleteAdmin(adminId) {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Execute the delete query
        const result = await connection.execute(
            `DELETE FROM Admins WHERE Admin_id = :1`,
            [adminId],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            throw new Error('Admin not found with the given ID.');
        }

        return result;
    } catch (err) {
        console.error("Error in deleteAdmin: ", err.message || err);
        throw err;  // Propagate the error
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllAdmins, createAdmin, updateAdmin, deleteAdmin };
