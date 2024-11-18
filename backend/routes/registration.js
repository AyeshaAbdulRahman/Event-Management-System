// routes/registration.js
const express = require('express');
const router = express.Router();
const { getAllRegistrationsController, createRegistrationController, updateRegistrationController, deleteRegistrationController } = require('../controller/registrationController');


// Routes for registrations
router.get('/', getAllRegistrationsController);  // Get all registrations
router.post('/', createRegistrationController);  // Create a new registration
router.put('/:registrationId', updateRegistrationController);  // Update registration by ID
router.delete('/:registrationId', deleteRegistrationController);  // Delete registration by ID

module.exports = router;
