// controllers/participantsController.js
const { getAllParticipants, createParticipant, updateParticipant, deleteParticipant } = require('../models/participantModel');

// Get all participants
async function getAllParticipantsController(req, res) {
    try {
        const participants = await getAllParticipants();
        res.status(200).json(participants);
    } catch (err) {
        console.error('Error in getAllParticipantsController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Create a new participant
async function createParticipantController(req, res) {
    const { Participant_id, Participant_Name, Event_id } = req.body;
    const participant = { Participant_id, Participant_Name, Event_id };

    try {
        await createParticipant(participant);
        res.status(201).send('Participant created successfully');
    } catch (err) {
        console.error('Error in createParticipantController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Update participant by ID
async function updateParticipantController(req, res) {
    const { participantId } = req.params;
    const { Participant_Name, Event_id } = req.body;
    const participant = { Participant_Name, Event_id };

    try {
        await updateParticipant(participantId, participant);
        res.status(200).send('Participant updated successfully');
    } catch (err) {
        console.error('Error in updateParticipantController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Delete participant by ID
async function deleteParticipantController(req, res) {
    const { participantId } = req.params;

    try {
        await deleteParticipant(participantId);
        res.status(200).send('Participant deleted successfully');
    } catch (err) {
        console.error('Error in deleteParticipantController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getAllParticipantsController, createParticipantController, updateParticipantController, deleteParticipantController };
