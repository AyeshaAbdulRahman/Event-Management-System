const venueModel = require('../models/venueModel');

// Get all venues
async function getAllVenues(req, res) {
    try {
        const venues = await venueModel.getAllVenues();
        res.status(200).json(venues);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching venues', error: error.message });
    }
}

// Get venue by ID
async function getVenueById(req, res) {
    const { id } = req.params;
    try {
        const venue = await venueModel.getVenueById(id);
        if (venue) {
            res.status(200).json(venue);
        } else {
            res.status(404).json({ message: 'Venue not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching venue', error: error.message });
    }
}

// Create new venue
async function createVenue(req, res) {
    const { Venue_Name, Venue_Location, Venue_Capacity, Venue_Type } = req.body;
    try {
        const result = await venueModel.createVenue({ 
            Venue_Name, 
            Venue_Location, 
            Venue_Capacity, 
            Venue_Type 
        });
        res.status(201).json({ message: 'Venue created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating venue', error: error.message });
    }
}

// Update venue by ID
async function updateVenueById(req, res) {
    const { id } = req.params;
    const { Venue_Name, Venue_Location, Venue_Capacity, Venue_Type } = req.body;
    try {
        const result = await venueModel.updateVenueById(id, { 
            Venue_Name, 
            Venue_Location, 
            Venue_Capacity, 
            Venue_Type 
        });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Venue updated successfully' });
        } else {
            res.status(404).json({ message: 'Venue not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating venue', error: error.message });
    }
}

// Delete venue by ID
async function deleteVenueById(req, res) {
    const { id } = req.params;
    try {
        const result = await venueModel.deleteVenueById(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Venue deleted successfully' });
        } else {
            res.status(404).json({ message: 'Venue not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting venue', error: error.message });
    }
}

module.exports = {
    getAllVenues,
    getVenueById,
    createVenue,
    updateVenueById,
    deleteVenueById
};
