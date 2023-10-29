const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/communicationController'); 

router.post('/chatrooms', matchingController.createMatch); 
router.get('/chatrooms', matchingController.getAllMatches); 
router.post('/chatrooms/:id', matchingController.getAllMatches); 

module.exports = router;
