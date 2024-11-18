// models/userModel.js
const oracledb = require('oracledb');

// Get all users
async function getAllUsers() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Users`);
        return result.rows;
    } catch (err) {
        console.error("Error in getAllUsers: ", err);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// Create a new user
async function createUser(user) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Users (User_id, F_name, L_name, Email, Role) VALUES (:1, :2, :3, :4, :5)`,
            [user.User_id, user.F_name, user.L_name, user.Email, user.Role],
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        console.error("Error in createUser: ", err);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// Update user by ID
async function updateUser(userId, user) {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Execute the update query
        const result = await connection.execute(
            `UPDATE Users SET F_name = :1, L_name = :2, Email = :3, Role = :4 WHERE User_id = :5`,
            [user.F_name, user.L_name, user.Email, user.Role, userId],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            throw new Error('User not found with the given ID.');
        }

        return result;
    } catch (err) {
        console.error("Error in updateUser: ", err.message || err);
        throw err;  // Propagate the error
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// Delete user by ID
async function deleteUser(userId) {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Execute the delete query
        const result = await connection.execute(
            `DELETE FROM Users WHERE User_id = :1`,
            [userId],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            throw new Error('User not found with the given ID.');
        }

        return result;
    } catch (err) {
        console.error("Error in deleteUser: ", err.message || err);
        throw err;  // Propagate the error
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
