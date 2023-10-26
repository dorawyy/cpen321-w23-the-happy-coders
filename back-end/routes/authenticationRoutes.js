const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

// Routes
router.post('/login/:idToken', authenticationController.handleLogin);
router.post('/signup/:idToken', authenticationController.handleSignup);

module.exports = router;