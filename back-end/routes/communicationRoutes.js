const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController'); 

router.post('', communicationController.createChatroom); 
router.get('', communicationController.getChatrooms); 
router.post('/:id', communicationController.sendMessage); 

module.exports = router;
