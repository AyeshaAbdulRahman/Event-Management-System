// routes/participants.js
const express = require('express');
const router = express.Router();
const { getAllParticipantsController, createParticipantController, updateParticipantController, deleteParticipantController } = require('../controller/participantsController');

// Routes for participants
router.get('/', getAllParticipantsController);  // Get all participants
router.post('/', createParticipantController);  // Create a new participant
router.put('/:participantId', updateParticipantController);  // Update participant by ID
router.delete('/:participantId', deleteParticipantController);  // Delete participant by ID

module.exports = router;
