const vendorsModel = require('../models/vendorsModel');

// Get all vendors
async function getAllVendors(req, res) {
    try {
        const vendors = await vendorsModel.getAllVendors();
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendors', error: error.message });
    }
}

// Get vendor by ID
async function getVendorById(req, res) {
    const { id } = req.params;
    try {
        const vendor = await vendorsModel.getVendorById(id);
        if (vendor) {
            res.status(200).json(vendor);
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendor', error: error.message });
    }
}

// Create new vendor
async function createVendor(req, res) {
    const { name, contactInfo } = req.body;
    try {
        const result = await vendorsModel.createVendor({ name, contactInfo });
        res.status(201).json({ message: 'Vendor created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating vendor', error: error.message });
    }
}

// Update vendor by ID
async function updateVendorById(req, res) {
    const { id } = req.params;
    const { name, contactInfo } = req.body;
    try {
        const result = await vendorsModel.updateVendorById(id, { name, contactInfo });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Vendor updated successfully' });
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating vendor', error: error.message });
    }
}

// Delete vendor by ID
async function deleteVendorById(req, res) {
    const { id } = req.params;
    try {
        const result = await vendorsModel.deleteVendorById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Vendor deleted successfully' });
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vendor', error: error.message });
    }
}

module.exports = {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendorById,
    deleteVendorById
};
