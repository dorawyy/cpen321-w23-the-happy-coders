const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController'); 


// Creates a match between two users
router.post('', matchingController.createMatch); 

module.exports = router;
