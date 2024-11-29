const { pool } = require('../db');

async function createSupplies(req, res) {
    try {
        const { eventId, vendorId, itemNames } = req.body;

        if (!eventId || !vendorId || !itemNames || !itemNames.length) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Insert each item into the supplies table
            for (const itemName of itemNames) {
                await connection.execute(`
                    INSERT INTO supplies (Event_Id, Vendor_Id, Item_Name)
                    VALUES (?, ?, ?)
                `, [eventId, vendorId, itemName]);
            }

            await connection.commit();
            res.status(201).json({ 
                message: 'Supplies added successfully',
                eventId,
                vendorId,
                itemCount: itemNames.length
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating supplies:', error);
        res.status(500).json({ message: 'Error creating supplies' });
    }
}

async function getEventSupplies(req, res) {
    try {
        const eventId = req.params.eventId;
        const connection = await pool.getConnection();
        
        try {
            const [supplies] = await connection.execute(`
                SELECT 
                    s.Item_Name,
                    v.Vendor_Name
                FROM supplies s
                JOIN vendors v ON s.Vendor_Id = v.Vendor_Id
                WHERE s.Event_Id = ?
                ORDER BY v.Vendor_Name
            `, [eventId]);

            res.json(supplies);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching event supplies:', error);
        res.status(500).json({ message: 'Error fetching supplies' });
    }
}

module.exports = {
    createSupplies,
    getEventSupplies
}; 