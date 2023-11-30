const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');

router.get('/:badgeId', badgeController.getBadges);