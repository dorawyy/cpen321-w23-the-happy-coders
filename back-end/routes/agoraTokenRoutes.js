const express = require('express');
const router = express.Router();
const agoraTokenController = require('../controllers/agoraTokenController');

// Returns a token for a user to join a channel
router.get('/:channel/:role/:tokentype/:uid', agoraTokenController.getRTCToken); 

module.exports = router;
