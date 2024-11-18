// controllers/eventsController.js
const { getAllEvents, createEvent, updateEvent, deleteEvent } = require('../models/eventModel');

// Get all events
async function getAllEventsController(req, res) {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (err) {
        console.error('Error in getAllEventsController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Create a new event
async function createEventController(req, res) {
    const { Event_id, Event_Name, Event_Date, Venue, Organizer } = req.body;
    const event = { Event_id, Event_Name, Event_Date, Venue, Organizer };

    try {
        await createEvent(event);
        res.status(201).send('Event created successfully');
    } catch (err) {
        console.error('Error in createEventController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Update event by ID
async function updateEventController(req, res) {
    const { eventId } = req.params;
    const { Event_Name, Event_Date, Venue, Organizer } = req.body;
    const event = { Event_Name, Event_Date, Venue, Organizer };

    try {
        await updateEvent(eventId, event);
        res.status(200).send('Event updated successfully');
    } catch (err) {
        console.error('Error in updateEventController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Delete event by ID
async function deleteEventController(req, res) {
    const { eventId } = req.params;

    try {
        await deleteEvent(eventId);
        res.status(200).send('Event deleted successfully');
    } catch (err) {
        console.error('Error in deleteEventController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getAllEventsController, createEventController, updateEventController, deleteEventController };
