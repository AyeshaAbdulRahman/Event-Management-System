const clientModel = require('../models/clientModel');

// Get all clients
async function getAllClients(req, res) {
    try {
        const clients = await clientModel.getAllClients();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error: error.message });
    }
}

// Get client by ID
async function getClientById(req, res) {
    const { id } = req.params;
    try {
        const client = await clientModel.getClientById(id);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client', error: error.message });
    }
}

// Create new client
async function createClient(req, res) {
    const { email, firstName, lastName } = req.body;
    try {
        const result = await clientModel.createClient({ email, firstName, lastName });
        res.status(201).json({ message: 'Client created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error: error.message });
    }
}

// Update client by ID
async function updateClientById(req, res) {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    try {
        const result = await clientModel.updateClientById(id, { firstName, lastName });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Client updated successfully' });
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error: error.message });
    }
}

// Delete client by ID
async function deleteClientById(req, res) {
    const { id } = req.params;
    try {
        const result = await clientModel.deleteClientById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Client deleted successfully' });
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error: error.message });
    }
}

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClientById,
    deleteClientById
};
