const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Creates a google calendar event
router.post('', eventController.createEvent);

router.delete('/:eventId', eventController.deleteEvent);

router.get('/:hostUserId', eventController.getEvents);
router.get('/:hostUserId/:invitedUserId', eventController.getEvents);


module.exports = router;