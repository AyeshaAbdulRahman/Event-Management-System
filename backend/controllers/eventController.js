const Event = require('../models/Event');
const db = require('../db');

async function getAllEvents(req, res) {
    try {
        const events = await Event.getAllEvents();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
}

async function createEvent(req, res) {
    try {
        const eventData = req.body;
        const eventId = await Event.createEvent(eventData);
        res.status(201).json({ message: 'Event created successfully', eventId });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
}

async function updateEventStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const success = await Event.updateEventStatus(id, status);
        if (success) {
            res.json({ message: 'Event status updated successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error updating event status:', error);
        res.status(500).json({ message: 'Error updating event status' });
    }
}

async function createNewEvent(req, res) {
    try {
        const pool = db.getPool();
        if (!pool) {
            throw new Error('Database pool not initialized');
        }

        const connection = await pool.getConnection();
        try {
            const { eventName, eventType, eventDate, venueId, clientId } = req.body;
            
            const [result] = await connection.execute(
                'INSERT INTO events (Event_Name, Event_Type, Date, Client_Id, Venue_Id) VALUES (?, ?, ?, ?, ?)',
                [eventName, eventType, eventDate, clientId, venueId]
            );

            res.status(201).json({ 
                message: 'Event created successfully', 
                eventId: result.insertId 
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
}

module.exports = {
    getAllEvents,
    createEvent,
    updateEventStatus,
    createNewEvent
}; 