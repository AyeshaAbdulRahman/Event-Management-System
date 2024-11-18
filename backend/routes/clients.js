// routes/clients.js
const express = require('express');
const router = express.Router();
const { getAllClientsController, createClientController, updateClientController, deleteClientController } = require('../controller/clientsController');

// Routes for clients
router.get('/', getAllClientsController);  // Get all clients
router.post('/', createClientController);  // Create a new client
router.put('/:clientId', updateClientController);  // Update client by ID
router.delete('/:clientId', deleteClientController);  // Delete client by ID

module.exports = router;
