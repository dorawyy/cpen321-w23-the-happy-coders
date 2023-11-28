const express = require('express');
const router = express.Router();
const googleCalendarController = require('../controllers/googleCalendarController');

// Creates a google calendar event
router.post('', googleCalendarController.createEvent);

router.get('/:hostUserId', googleCalendarController.getEvents);
router.get('/:hostUserId/:invitedUserId', googleCalendarController.getEvents);


module.exports = router;