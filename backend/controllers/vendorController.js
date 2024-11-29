const { pool } = require('../db');

async function getAllVendors(req, res) {
    try {
        const connection = await pool.getConnection();
        try {
            const [vendors] = await connection.execute(`
                SELECT 
                    v.Vendor_Id,
                    v.Vendor_Name,
                    GROUP_CONCAT(i.Item_Name) as Items
                FROM vendors v
                LEFT JOIN vendor_items vi ON v.Vendor_Id = vi.Vendor_Id
                LEFT JOIN items i ON vi.Item_Id = i.Item_Id
                GROUP BY v.Vendor_Id
                ORDER BY v.Vendor_Name
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

module.exports = {
    getAllVendors
}; 