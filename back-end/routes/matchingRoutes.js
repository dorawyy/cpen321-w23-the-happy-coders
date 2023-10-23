const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController'); // Import your matching controller

// Routes
router.post('/match', matchingController.createMatch); 
router.get('/matches/:userId', matchingController.getMatchesForUser); 
router.get('/match', matchingController.getAllMatches); 

module.exports = router;
