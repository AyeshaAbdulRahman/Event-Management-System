const eventModel = require('../models/eventModel');

// Get all events
async function getAllEvents(req, res) {
    try {
        const events = await eventModel.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
}

// Get event by ID
async function getEventById(req, res) {
    const { id } = req.params;
    try {
        const event = await eventModel.getEventById(id);
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
}

// Create new event
async function createEvent(req, res) {
    const { name, type, date, clientId, venueId } = req.body;
    try {
        const result = await eventModel.createEvent({ name, type, date, clientId, venueId });
        res.status(201).json({ message: 'Event created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
}

// Update event by ID
async function updateEventById(req, res) {
    const { id } = req.params;
    const { name, type, date, clientId, venueId } = req.body;
    try {
        const result = await eventModel.updateEventById(id, { name, type, date, clientId, venueId });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Event updated successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
}

// Delete event by ID
async function deleteEventById(req, res) {
    const { id } = req.params;
    try {
        const result = await eventModel.deleteEventById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
}

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEventById,
    deleteEventById
};
