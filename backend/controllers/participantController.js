const Participant = require('../models/participantModel');

async function createParticipant(req, res) {
    console.log('Received request body:', req.body);
    console.log('participantName:', req.body.participantName);
    console.log('eventId:', req.body.eventId);

    try {
        const { participantName, eventId } = req.body;

        if (!participantName || !eventId) {
            console.log('Missing fields - participantName:', participantName, 'eventId:', eventId);
            return res.status(400).json({ message: 'Participant name and event ID are required' });
        }

        if (isNaN(parseInt(eventId))) {
            return res.status(400).json({ message: 'Invalid Event ID format' });
        }

        const result = await Participant.createParticipant(participantName, eventId);
        
        res.status(201).json({
            message: 'Participant registered successfully',
            participantId: result.insertId
        });
    } catch (error) {
        console.error('Error creating participant:', error);
        if (error.message === 'Invalid Event ID') {
            res.status(400).json({ message: 'Invalid Event ID provided' });
        } else {
            res.status(500).json({ message: 'Error registering participant' });
        }
    }
}

async function getParticipantsByEvent(req, res) {
    try {
        const eventId = req.params.eventId;
        const participants = await Participant.getParticipantsByEvent(eventId);
        res.json(participants);
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Error fetching participants' });
    }
}

async function getAllParticipants(req, res) {
    try {
        const participants = await Participant.getAllParticipants();
        res.json(participants);
    } catch (error) {
        console.error('Error fetching all participants:', error);
        res.status(500).json({ message: 'Error fetching participants' });
    }
}

module.exports = {
    createParticipant,
    getParticipantsByEvent,
    getAllParticipants
}; 