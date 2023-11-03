const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController'); 

router.post('', matchingController.createMatch); 

module.exports = router;
