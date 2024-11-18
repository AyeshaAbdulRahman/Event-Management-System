// controllers/usersController.js
const { getAllUsers, createUser, updateUser, deleteUser } = require('../models/userModel');

// Get all users
async function getAllUsersController(req, res) {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error in getAllUsersController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Create a new user
async function createUserController(req, res) {
    const { User_id, F_name, L_name, Email, Role } = req.body;
    const user = { User_id, F_name, L_name, Email, Role };

    try {
        await createUser(user);
        res.status(201).send('User created successfully');
    } catch (err) {
        console.error('Error in createUserController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Update user by ID
async function updateUserController(req, res) {
    const { userId } = req.params;
    const { F_name, L_name, Email, Role } = req.body;
    const user = { F_name, L_name, Email, Role };

    try {
        await updateUser(userId, user);
        res.status(200).send('User updated successfully');
    } catch (err) {
        console.error('Error in updateUserController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Delete user by ID
async function deleteUserController(req, res) {
    const { userId } = req.params;

    try {
        await deleteUser(userId);
        res.status(200).send('User deleted successfully');
    } catch (err) {
        console.error('Error in deleteUserController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getAllUsersController, createUserController, updateUserController, deleteUserController };
