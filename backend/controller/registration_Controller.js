const registrationModel = require('../models/RegistrationModel');

// Get all registrations
async function getAllRegistrations(req, res) {
    try {
        const registrations = await registrationModel.getAllRegistrations();
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registrations', error: error.message });
    }
}

// Get registration by ID
async function getRegistrationById(req, res) {
    const { id } = req.params;
    try {
        const registration = await registrationModel.getRegistrationById(id);
        if (registration) {
            res.status(200).json(registration);
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registration', error: error.message });
    }
}

// Create new registration
async function createRegistration(req, res) {
    const { eventId, participantId, registrationDate } = req.body;
    try {
        const result = await registrationModel.createRegistration({ eventId, participantId, registrationDate });
        res.status(201).json({ message: 'Registration created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating registration', error: error.message });
    }
}

// Update registration by ID
async function updateRegistrationById(req, res) {
    const { id } = req.params;
    const { eventId, participantId, registrationDate } = req.body;
    try {
        const result = await registrationModel.updateRegistrationById(id, { eventId, participantId, registrationDate });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Registration updated successfully' });
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating registration', error: error.message });
    }
}

// Delete registration by ID
async function deleteRegistrationById(req, res) {
    const { id } = req.params;
    try {
        const result = await registrationModel.deleteRegistrationById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Registration deleted successfully' });
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting registration', error: error.message });
    }
}

module.exports = {
    getAllRegistrations,
    getRegistrationById,
    createRegistration,
    updateRegistrationById,
    deleteRegistrationById
};
