const express = require('express');
const router = express.Router();
const googleCalendarController = require('../controllers/googleCalendarCotroller');
// Routes
router.get('/createEvent/:authCode', googleCalendarController.createEvent);
module.exports = router;