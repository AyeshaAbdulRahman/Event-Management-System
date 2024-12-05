const Event = require('../models/eventModel');
const { pool } = require('../db');
const Task = require('../models/taskModel');

async function getAllEvents(req, res) {
    try {
        const connection = await pool.getConnection();
        try {
            const [events] = await connection.execute(`
                SELECT 
                    e.Event_Id,
                    e.Event_Name,
                    e.Event_Type,
                    e.Date,
                    v.Venue_Name,
                    v.City as Venue_City,
                    u.First_Name,
                    u.Last_Name,
                    CONCAT(u.First_Name, ' ', u.Last_Name) as Organizer_Name
                FROM events e
                LEFT JOIN venues v ON e.Venue_Id = v.Venue_Id
                LEFT JOIN clients c ON e.Client_Id = c.Client_Id
                LEFT JOIN users u ON c.User_Id = u.User_Id
                ORDER BY e.Date DESC
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
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { eventName, eventType, eventDate, venueId, clientId, payment } = req.body;
        
        // First: Create event
        const [eventResult] = await connection.execute(
            'INSERT INTO events (Event_Name, Event_Type, Date, Client_Id, Venue_Id) VALUES (?, ?, ?, ?, ?)',
            [eventName, eventType, eventDate, clientId, venueId]
        );

        const eventId = eventResult.insertId;

        // Second: Create event payment
        await connection.execute(
            'INSERT INTO event_payment (Event_Id, Payment) VALUES (?, ?)',
            [eventId, payment]
        );

        // Commit the event and payment creation
        await connection.commit();

        // Third: After event is committed, create tasks
        try {
            await Task.createTasksForEvent(eventId, eventType);
            
            res.status(201).json({ 
                message: 'Event and tasks created successfully', 
                eventId: eventId 
            });
        } catch (taskError) {
            console.error('Error creating tasks:', taskError);
            // Even if tasks fail, the event was created successfully
            res.status(201).json({ 
                message: 'Event created successfully, but tasks creation failed', 
                eventId: eventId 
            });
        }

    } catch (error) {
        await connection.rollback();
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    } finally {
        connection.release();
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
                    v.City,
                    CONCAT(u.First_Name, ' ', u.Last_Name) as Organizer_Name
                FROM events e
                JOIN venues v ON e.Venue_Id = v.Venue_Id
                JOIN clients c ON e.Client_Id = c.Client_Id
                JOIN users u ON c.User_Id = u.User_Id
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

async function getEventPayment(req, res) {
    try {
        const eventId = req.params.eventId;
        const connection = await pool.getConnection();
        
        try {
            const [rows] = await connection.execute(
                'SELECT Payment FROM event_payment WHERE Event_Id = ?',
                [eventId]
            );
            
            if (rows.length > 0) {
                res.json({ payment: rows[0].Payment });
            } else {
                res.status(404).json({ message: 'Event payment not found' });
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching event payment:', error);
        res.status(500).json({ message: 'Error fetching event payment' });
    }
}

module.exports = {
    getAllEvents,
    createEvent,
    updateEventStatus,
    createNewEvent,
    getClientBookings,
    getEventPayment
}; 