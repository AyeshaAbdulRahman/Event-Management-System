// routes/venues.js
const express = require('express');
const router = express.Router();
const { getAllVenuesController, createVenueController, updateVenueController, deleteVenueController } = require('../controller/venuesController');

// Routes for venues
router.get('/', getAllVenuesController);  // Get all venues
router.post('/', createVenueController);  // Create a new venue
router.put('/:venueId', updateVenueController);  // Update venue by ID
router.delete('/:venueId', deleteVenueController);  // Delete venue by ID

module.exports = router;
