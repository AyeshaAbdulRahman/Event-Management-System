const Event = require('../models/eventModel');
const { pool } = require('../db');

async function getAllEvents(req, res) {
    try {
        const connection = await pool.getConnection();
        try {
            const [events] = await connection.execute(`
                SELECT 
                    Event_Id,
                    Event_Name,
                    Event_Type,
                    Date,
                    Venue_Id
                FROM events
                ORDER BY Date DESC
            `);
            
            console.log('Events being sent:', events);
            res.json(events);
        } finally {
            connection.release();
        }
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

async function getClientBookings(req, res) {
    try {
        const clientId = req.params.clientId;
        const connection = await pool.getConnection();
        try {
            const [bookings] = await connection.execute(`
                SELECT 
                    e.Event_Id,
                    e.Event_Name,
                    e.Event_Type,
                    e.Date,
                    v.Venue_Name,
                    v.City
                FROM events e
                JOIN venues v ON e.Venue_Id = v.Venue_Id
                WHERE e.Client_Id = ?
                ORDER BY e.Date DESC
            `, [clientId]);
            
            res.json(bookings);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching client bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
}

module.exports = {
    getAllEvents,
    createEvent,
    updateEventStatus,
    createNewEvent,
    getClientBookings
}; 