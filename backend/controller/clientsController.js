// controllers/clientsController.js
const { getAllClients, createClient, updateClient, deleteClient } = require('../models/clientModel');

// Get all clients
async function getAllClientsController(req, res) {
    try {
        const clients = await getAllClients();
        res.status(200).json(clients);
    } catch (err) {
        console.error('Error in getAllClientsController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Create a new client
async function createClientController(req, res) {
    const { Client_id, Client_Name, Contact_Info } = req.body;
    const client = { Client_id, Client_Name, Contact_Info };

    try {
        await createClient(client);
        res.status(201).send('Client created successfully');
    } catch (err) {
        console.error('Error in createClientController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Update client by ID
async function updateClientController(req, res) {
    const { clientId } = req.params;
    const { Client_Name, Contact_Info } = req.body;
    const client = { Client_Name, Contact_Info };

    try {
        await updateClient(clientId, client);
        res.status(200).send('Client updated successfully');
    } catch (err) {
        console.error('Error in updateClientController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Delete client by ID
async function deleteClientController(req, res) {
    const { clientId } = req.params;

    try {
        await deleteClient(clientId);
        res.status(200).send('Client deleted successfully');
    } catch (err) {
        console.error('Error in deleteClientController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getAllClientsController, createClientController, updateClientController, deleteClientController };
