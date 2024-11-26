const mysql = require('mysql2/promise');
const { getPool } = require('../db');

// Get all supplies
async function getAllSupplies() {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT s.Vendor_Id, v.Vendor_Name, s.Event_Id, e.Event_Name, s.Item_Name
            FROM Supplies s
            JOIN Vendors v ON s.Vendor_Id = v.Vendor_Id
            JOIN Events e ON s.Event_Id = e.Event_Id`);
        return rows;
    } finally {
        connection.release();
    }
}

// Get supplies by Supply Id
async function getSupplyById(vendorId, eventId, itemName) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT s.Vendor_Id, v.Vendor_Name, s.Event_Id, e.Event_Name, s.Item_Name
            FROM Supplies s
            JOIN Vendors v ON s.Vendor_Id = v.Vendor_Id
            JOIN Events e ON s.Event_Id = e.Event_Id
            WHERE s.Vendor_Id = ? AND s.Event_Id = ? AND s.Item_Name = ?`,
            [vendorId, eventId, itemName]);
        return rows[0];
    } finally {
        connection.release();
    }
}

// Add a new supply
async function createSupply(supply) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            INSERT INTO Supplies (Vendor_Id, Event_Id, Item_Name)
            VALUES (?, ?, ?)`,
            [supply.Vendor_Id, supply.Event_Id, supply.Item_Name]);
        return result;
    } finally {
        connection.release();
    }
}

// Delete supply by Vendor Id, Event Id, and Item Name
async function deleteSupplyById(vendorId, eventId, itemName) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(`
            DELETE FROM Supplies WHERE Vendor_Id = ? AND Event_Id = ? AND Item_Name = ?`,
            [vendorId, eventId, itemName]);
        return result;
    } finally {
        connection.release();
    }
}

module.exports = { getAllSupplies, getSupplyById, createSupply, deleteSupplyById };
