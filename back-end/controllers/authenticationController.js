const express = require('express');
const router = express.Router();
const authenticationServices = require('../services/authenticationService');

async function handleGoogleLogin(req, res) {
    let idToken = req.params.idToken;

    const verificationResult = await authenticationServices.verifyGoogleToken(idToken);

    if (verificationResult.success) {
        // TODO: Check that user is in the database and return their info
        res.status(200).json({ success: true, userId: verificationResult.email});
    } else {
        res.status(401).json({ success: false, message: verificationResult.error });
    }
}

async function handleGoogleSignUp(req, res) {
    let idToken = req.params.idToken;

    const verificationResult = await authenticationServices.verifyGoogleToken(idToken);

    if (verificationResult.success) {
        // TODO: Add user to the database
        res.status(200).json({ success: true, userId: verificationResult.email});
    } else {
        res.status(401).json({ success: false, message: verificationResult.error });
    }
}

module.exports = router;