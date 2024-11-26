const express = require('express');
const router = express.Router();
const participantController = require('../controller/participantsController');
router.get('/', participantController.getAllParticipants);
router.get('/:id', participantController.getParticipantById);
router.post('/', participantController.createParticipant);
router.put('/:id', participantController.updateParticipantById);
router.delete('/:id', participantController.deleteParticipantById);

module.exports = router;
