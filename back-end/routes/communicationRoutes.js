const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController'); 

router.get('/:userId', communicationController.getChatrooms); 
router.post('/:id/messages', communicationController.sendMessage); 
router.get('/:cid/ai', communicationController.startLearningSession); 
router.get('/:cid/messages', communicationController.getMessages)

module.exports = router;
