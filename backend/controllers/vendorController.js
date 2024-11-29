const { pool } = require('../db');

async function getAllVendors(req, res) {
    try {
        const connection = await pool.getConnection();
        try {
            const [vendors] = await connection.execute(`
                SELECT Vendor_Id, Vendor_Name
                FROM vendors
                ORDER BY Vendor_Name
            `);
            
            res.json(vendors);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ message: 'Error fetching vendors' });
    }
}

async function getVendorItems(req, res) {
    try {
        const vendorId = req.params.vendorId;
        const connection = await pool.getConnection();
        try {
            const [items] = await connection.execute(`
                SELECT i.Item_Id, i.Item_Name
                FROM items i
                JOIN vendor_items vi ON i.Item_Id = vi.Item_Id
                WHERE vi.Vendor_Id = ?
            `, [vendorId]);
            
            console.log('Fetched items for vendor:', items); // Debug log
            res.json(items);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching vendor items:', error);
        res.status(500).json({ message: 'Error fetching vendor items' });
    }
}

async function getVendorSupplies(req, res) {
    try {
        const vendorId = req.params.vendorId;
        const connection = await pool.getConnection();
        try {
            const [supplies] = await connection.execute(`
                SELECT 
                    s.Item_Name,
                    e.Event_Name
                FROM supplies s
                JOIN events e ON s.Event_Id = e.Event_Id
                WHERE s.Vendor_Id = ?
                ORDER BY e.Event_Name
            `, [vendorId]);
            
            res.json(supplies);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching vendor supplies:', error);
        res.status(500).json({ message: 'Error fetching vendor supplies' });
    }
}

module.exports = {
    getAllVendors,
    getVendorItems,
    getVendorSupplies
}; 