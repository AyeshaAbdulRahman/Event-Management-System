const suppliesModel = require('../models/SuppliesModel');

// Get all supplies
async function getAllSupplies(req, res) {
    try {
        const supplies = await suppliesModel.getAllSupplies();
        res.status(200).json(supplies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching supplies', error: error.message });
    }
}

// Get supply by ID
async function getSupplyById(req, res) {
    const { id } = req.params;
    try {
        const supply = await suppliesModel.getSupplyById(id);
        if (supply) {
            res.status(200).json(supply);
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching supply', error: error.message });
    }
}

// Create new supply
async function createSupply(req, res) {
    const { name, quantity, price } = req.body;
    try {
        const result = await suppliesModel.createSupply({ name, quantity, price });
        res.status(201).json({ message: 'Supply created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating supply', error: error.message });
    }
}

// Update supply by ID
async function updateSupplyById(req, res) {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    try {
        const result = await suppliesModel.updateSupplyById(id, { name, quantity, price });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Supply updated successfully' });
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating supply', error: error.message });
    }
}

// Delete supply by ID
async function deleteSupplyById(req, res) {
    const { id } = req.params;
    try {
        const result = await suppliesModel.deleteSupplyById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Supply deleted successfully' });
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting supply', error: error.message });
    }
}

module.exports = {
    getAllSupplies,
    getSupplyById,
    createSupply,
    updateSupplyById,
    deleteSupplyById
};
