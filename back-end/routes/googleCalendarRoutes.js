const express = require('express');
const router = express.Router();
const googleCalendarController = require('../controllers/googleCalendarController');

// Creates a google calendar event
router.post('', googleCalendarController.createEvent);

module.exports = router;