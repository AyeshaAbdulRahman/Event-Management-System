const participantModel = require('../models/participantModel');

// Get all participants
async function getAllParticipants(req, res) {
    try {
        const participants = await participantModel.getAllParticipants();
        res.status(200).json(participants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching participants', error: error.message });
    }
}

// Get participant by ID
async function getParticipantById(req, res) {
    const { id } = req.params;
    try {
        const participant = await participantModel.getParticipantById(id);
        if (participant) {
            res.status(200).json(participant);
        } else {
            res.status(404).json({ message: 'Participant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching participant', error: error.message });
    }
}

// Create new participant
async function createParticipant(req, res) {
    const { name, eventId, status } = req.body;
    try {
        const result = await participantModel.createParticipant({ name, eventId, status });
        res.status(201).json({ message: 'Participant created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating participant', error: error.message });
    }
}

// Update participant by ID
async function updateParticipantById(req, res) {
    const { id } = req.params;
    const { name, eventId, status } = req.body;
    try {
        const result = await participantModel.updateParticipantById(id, { name, eventId, status });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Participant updated successfully' });
        } else {
            res.status(404).json({ message: 'Participant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating participant', error: error.message });
    }
}

// Delete participant by ID
async function deleteParticipantById(req, res) {
    const { id } = req.params;
    try {
        const result = await participantModel.deleteParticipantById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Participant deleted successfully' });
        } else {
            res.status(404).json({ message: 'Participant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting participant', error: error.message });
    }
}

module.exports = {
    getAllParticipants,
    getParticipantById,
    createParticipant,
    updateParticipantById,
    deleteParticipantById
};
