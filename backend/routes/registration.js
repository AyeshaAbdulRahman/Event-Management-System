const express = require('express');
const router = express.Router();
const registrationController = require('../controller/registration_Controller');
router.get('/', registrationController.getAllRegistrations);
router.get('/:id', registrationController.getRegistrationById);
router.post('/', registrationController.createRegistration);
router.put('/:id', registrationController.updateRegistrationById);
router.delete('/:id', registrationController.deleteRegistrationById);

module.exports = router;
