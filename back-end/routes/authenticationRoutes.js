const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

// Handles user login
router.post('/login', authenticationController.handleLogin);

// Handles admin login
router.post('/admin-login', authenticationController.handleAdminLogin);

// Handles user signup
router.post('/signup', authenticationController.handleSignup);

module.exports = router;