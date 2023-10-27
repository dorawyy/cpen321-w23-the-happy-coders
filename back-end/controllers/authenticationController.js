const authenticationServices = require('../services/authenticationService');

exports.handleLogin = async (req, res) => {
    let idToken = req.params.idToken;

    const verificationResult = await authenticationServices.verifyGoogleToken(idToken);

    if (verificationResult.success) {
        // TODO: Check that user is in the database and return their info
        res.status(200).json({ success: true, userId: verificationResult.email});
    } else {
        res.status(401).json({ success: false, message: verificationResult.error });
    }
};

exports.handleSignup = async (req, res) => {
    let idToken = req.params.idToken;

    const verificationResult = await authenticationServices.verifyGoogleToken(idToken);

    if (verificationResult.success) {
        // TODO: Add user to the database
        res.status(200).json({ success: true, userId: verificationResult.email});
    } else {
        res.status(401).json({ success: false, message: verificationResult.error });
    }
};
