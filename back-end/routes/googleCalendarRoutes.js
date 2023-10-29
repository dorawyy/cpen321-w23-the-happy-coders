const express = require('express');
const router = express.Router();
const googleCalendarController = require('../controllers/googleCalendarController');

// Routes
router.post('', googleCalendarController.createEvent);

module.exports = router;