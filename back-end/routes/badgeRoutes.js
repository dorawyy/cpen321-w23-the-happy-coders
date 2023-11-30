const express = require('express');
const router = express.Router();

router.get('/:badgeId', eventController.getEvents);