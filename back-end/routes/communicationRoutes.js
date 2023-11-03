const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController'); 

// Gets all the chatrooms associated with a user id
router.get('/:userId', communicationController.getChatrooms); 

// Sends message to chatroom
router.post('/:id/messages', communicationController.sendMessage); 

// Gets all messages in a chatroom
router.get('/:cid/messages', communicationController.getMessages)

module.exports = router;
