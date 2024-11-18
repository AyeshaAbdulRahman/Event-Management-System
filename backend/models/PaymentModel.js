const oracledb = require('oracledb');

async function getAllPayments() {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Payment`);
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
}   

async function createPayment(payment) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Payment (Payment_id, Participant_id, Amount) VALUES (:1, :2, :3)`,
            [payment.Payment_id, payment.Participant_id, payment.Amount],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function updatePayment(id, payment) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE Payment SET Participant_id = :1, Amount = :2 WHERE Payment_id = :3`,
            [payment.Participant_id, payment.Amount, id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

async function deletePayment(id) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM Payment WHERE Payment_id = :1`,
            [id],
            { autoCommit: true }
        );
        return result;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getAllPayments, createPayment, updatePayment, deletePayment };
