// controllers/venuesController.js
const { getAllVenues, createVenue, updateVenue, deleteVenue } = require('../models/venueModel');

// Get all venues
async function getAllVenuesController(req, res) {
    try {
        const venues = await getAllVenues();
        res.status(200).json(venues);
    } catch (err) {
        console.error('Error in getAllVenuesController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Create a new venue
async function createVenueController(req, res) {
    const { Venue_id, Venue_Name, Location } = req.body;
    const venue = { Venue_id, Venue_Name, Location };

    try {
        await createVenue(venue);
        res.status(201).send('Venue created successfully');
    } catch (err) {
        console.error('Error in createVenueController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Update venue by ID
async function updateVenueController(req, res) {
    const { venueId } = req.params;
    const { Venue_Name, Location } = req.body;
    const venue = { Venue_Name, Location };

    try {
        await updateVenue(venueId, venue);
        res.status(200).send('Venue updated successfully');
    } catch (err) {
        console.error('Error in updateVenueController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

// Delete venue by ID
async function deleteVenueController(req, res) {
    const { venueId } = req.params;

    try {
        await deleteVenue(venueId);
        res.status(200).send('Venue deleted successfully');
    } catch (err) {
        console.error('Error in deleteVenueController: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getAllVenuesController, createVenueController, updateVenueController, deleteVenueController };
