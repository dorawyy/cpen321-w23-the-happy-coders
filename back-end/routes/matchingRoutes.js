const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController'); 

router.post('/match', matchingController.createMatch); 
router.get('/match', matchingController.getAllMatches); 

module.exports = router;
