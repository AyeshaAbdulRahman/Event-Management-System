const express = require('express');
const router = express.Router();
const venueController = require('../controller/venuesController');
router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);
router.post('/', venueController.createVenue);
router.put('/:id', venueController.updateVenueById);
router.delete('/:id', venueController.deleteVenueById);

module.exports = router;
