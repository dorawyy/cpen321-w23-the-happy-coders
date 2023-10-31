const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController'); 

router.get('/:userId', communicationController.getChatrooms); 
router.get('/:chatroomId/messages', communicationController.getMessages); 
router.post('/:id/messages', communicationController.sendMessage); 

module.exports = router;
