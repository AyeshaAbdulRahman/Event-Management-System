// controllers/adminsController.js
const { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../models/AdminModel');

// Get all admins
async function getAllAdminsController(req, res) {
    try {
        const admins = await getAllAdmins();
        res.status(200).json(admins);
    } catch (err) {
        console.error('Error in getAllAdminsController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Create a new admin
async function createAdminController(req, res) {
    const { Admin_id, Admin_Name, Role } = req.body;
    const admin = { Admin_id, Admin_Name, Role };

    try {
        await createAdmin(admin);
        res.status(201).send('Admin created successfully');
    } catch (err) {
        console.error('Error in createAdminController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Update admin by ID
async function updateAdminController(req, res) {
    const { adminId } = req.params;
    const { Admin_Name, Role } = req.body;
    const admin = { Admin_Name, Role };

    try {
        await updateAdmin(adminId, admin);
        res.status(200).send('Admin updated successfully');
    } catch (err) {
        console.error('Error in updateAdminController: ', err);
        if (err.message.includes('not found')) {
            res.status(404).send('Admin not found');
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

// Delete admin by ID
async function deleteAdminController(req, res) {
    const { adminId } = req.params;

    try {
        await deleteAdmin(adminId);
        res.status(200).send('Admin deleted successfully');
    } catch (err) {
        console.error('Error in deleteAdminController: ', err);
        if (err.message.includes('not found')) {
            res.status(404).send('Admin not found');
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = { getAllAdminsController, createAdminController, updateAdminController, deleteAdminController };
