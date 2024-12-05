const Participant = require('../models/participantModel');
const { pool } = require('../db');

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

async function getParticipantById(req, res) {
    try {
        const participantId = req.params.participantId;
        console.log('Fetching participant with ID:', participantId);

        const connection = await pool.getConnection();
        
        try {
            const [rows] = await connection.execute(`
                SELECT 
                    p.Participant_Id,
                    p.Participant_Name,
                    e.Event_Id,
                    e.Event_Name,
                    ep.Payment as Event_Payment
                FROM participants p
                JOIN events e ON p.Event_Id = e.Event_Id
                JOIN event_payment ep ON e.Event_Id = ep.Event_Id
                WHERE p.Participant_Id = ?
            `, [participantId]);
            
            console.log('Query result:', rows);
            
            if (rows.length === 0) {
                console.log('No participant found with ID:', participantId);
                return res.status(404).json({ 
                    message: 'Participant not found',
                    participantId: participantId
                });
            }
            
            console.log('Participant data with payment:', rows[0]);
            res.json(rows[0]);
        } catch (dbError) {
            console.error('Database error:', dbError);
            throw dbError;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in getParticipantById:', error);
        res.status(500).json({ 
            message: 'Error fetching participant',
            error: error.message
        });
    }
}

async function createPayment(req, res) {
    try {
        const { participantId, amount } = req.body;
        const result = await Participant.createPayment(participantId, amount);
        res.status(201).json({ 
            message: 'Payment processed successfully',
            paymentId: result.insertId
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Error processing payment' });
    }
}

module.exports = {
    createParticipant,
    getParticipantsByEvent,
    getAllParticipants,
    getParticipantById,
    createPayment
}; 