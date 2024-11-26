const adminModel = require('../models/AdminModel');

// Get all admins
async function getAllAdmins(req, res) {
    try {
        const admins = await adminModel.getAllAdmins();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error: error.message });
    }
}

// Get admin by ID
async function getAdminById(req, res) {
    const { id } = req.params;
    try {
        const admin = await adminModel.getAdminById(id);
        if (admin) {
            res.status(200).json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin', error: error.message });
    }
}

// Get admin by Email
async function getAdminByEmail(req, res) {
    const { email } = req.params;
    try {
        const admin = await adminModel.getAdminByEmail(email);
        if (admin) {
            res.status(200).json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin', error: error.message });
    }
}

// Create a new admin
async function createAdmin(req, res) {
    const { email, Admin_Level } = req.body;
    try {
        const result = await adminModel.createAdmin({ email, Admin_Level });
        res.status(201).json({ message: 'Admin created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
}

// Update admin by ID
async function updateAdminById(req, res) {
    const { id } = req.params;
    const { Admin_Level } = req.body;
    try {
        const result = await adminModel.updateAdminById(id, { Admin_Level });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Admin updated successfully' });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin', error: error.message });
    }
}

// Delete admin by ID
async function deleteAdminById(req, res) {
    const { id } = req.params;
    try {
        const result = await adminModel.deleteAdminById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Admin deleted successfully' });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin', error: error.message });
    }
}

module.exports = {
    getAllAdmins,
    getAdminById,
    getAdminByEmail,
    createAdmin,
    updateAdminById,
    deleteAdminById
};
