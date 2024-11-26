const userModel = require('../models/userModel');

// Get all users
async function getAllUsers(req, res) {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

// Get user by ID
async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await userModel.getUserById(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
}

// Create new user
async function createUser(req, res) {
    const { username, password, role } = req.body;
    try {
        const result = await userModel.createUser({ username, password, role });
        res.status(201).json({ message: 'User created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

// Update user by ID
async function updateUserById(req, res) {
    const { id } = req.params;
    const { username, password, role } = req.body;
    try {
        const result = await userModel.updateUserById(id, { username, password, role });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

// Delete user by ID
async function deleteUserById(req, res) {
    const { id } = req.params;
    try {
        const result = await userModel.deleteUserById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById
};
