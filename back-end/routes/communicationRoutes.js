const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController'); 

router.get('/:id', communicationController.getChatrooms); 
router.post('', communicationController.sendMessage); 

module.exports = router;
