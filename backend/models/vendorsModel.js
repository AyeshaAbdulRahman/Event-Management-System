const mysql = require('mysql2/promise');
const { getPool } = require('../db');

async function getAllVendors() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT Vendor_Id, Vendor_Name FROM Vendors`);
        return rows;
    } finally {
        connection.release();
    }
}

async function getVendorById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT Vendor_Id, Vendor_Name FROM Vendors WHERE Vendor_Id = ?`, [id]);
        return rows[0];
    } finally {
        connection.release();
    }
}

async function createVendor(vendor) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Vendors (Vendor_Name) VALUES (?)`,
            [vendor.Vendor_Name]);
        return result;
    } finally {
        connection.release();
    }
}

async function deleteVendorById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE FROM Vendors WHERE Vendor_Id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllVendors, getVendorById, createVendor, deleteVendorById };
