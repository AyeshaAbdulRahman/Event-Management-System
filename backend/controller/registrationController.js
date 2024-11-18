// controllers/registrationController.js
const { getAllRegistrations, createRegistration, updateRegistration, deleteRegistration } = require('../models/RegistrationModel');

// Controller for getting all registrations
async function getAllRegistrationsController(req, res) {
    try {
        const registrations = await getAllRegistrations();
        res.json(registrations);
    } catch (err) {
        res.status(500).send("Error getting registrations");
    }
}

// Controller for creating a registration
async function createRegistrationController(req, res) {
    try {
        const registration = await createRegistration(req.body);
        res.status(201).json(registration);
    } catch (err) {
        res.status(500).send("Error creating registration");
    }
}

// Controller for updating a registration by ID
async function updateRegistrationController(req, res) {
    try {
        const registration = await updateRegistration(req.params.registrationId, req.body);
        res.json(registration);
    } catch (err) {
        res.status(500).send("Error updating registration");
    }
}

// Controller for deleting a registration by ID
async function deleteRegistrationController(req, res) {
    try {
        await deleteRegistration(req.params.registrationId);
        res.status(204).send();
    } catch (err) {
        res.status(500).send("Error deleting registration");
    }
}

module.exports = { getAllRegistrationsController, createRegistrationController, updateRegistrationController, deleteRegistrationController };
