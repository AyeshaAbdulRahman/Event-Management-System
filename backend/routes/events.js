// routes/events.js
const express = require('express');
const router = express.Router();
const { getAllEventsController, createEventController, updateEventController, deleteEventController } = require('../controller/eventsController');

// Routes for events
router.get('/', getAllEventsController);  // Get all events
router.post('/', createEventController);  // Create a new event
router.put('/:eventId', updateEventController);  // Update event by ID
router.delete('/:eventId', deleteEventController);  // Delete event by ID

module.exports = router;
