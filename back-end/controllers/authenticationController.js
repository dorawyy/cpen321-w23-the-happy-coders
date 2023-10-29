<<<<<<< HEAD
const { captureRejectionSymbol } = require('johnny-five/lib/board');
=======
>>>>>>> adding-authentication
const authenticationServices = require('../services/authenticationService');
const userServices = require('../services/userService');

exports.handleLogin = async (req, res) => {
    const idToken = req.body.idToken;
<<<<<<< HEAD
    console.log("Login with token " + idToken);
=======
>>>>>>> adding-authentication

    const verificationResult = await authenticationServices.verifyGoogleToken(idToken);

    if (verificationResult.success) {
<<<<<<< HEAD
        console.log("Verification successful");
        const payload = verificationResult.ticket.getPayload();
        const result = await userServices.findUserByEmail(payload.email);
        if (result.success) {
            console.log("User found");
            res.status(200).json({ success: true, user: result.user });
        }else{
            console.log("User not found");
            console.log(result);
            res.status(401).json(result);
        }
    } else {
        console.log("Verification failed");
=======
        // TODO: Check that user is in the database and return their info
        const user = await userServices.findOrCreateUser(verificationResult.ticket);
        console.log(user)
        res.status(200).json({ success: true, userId: user.email});
    } else {
>>>>>>> adding-authentication
        res.status(401).json({ success: false, message: verificationResult.error });
    }
};

exports.handleSignup = async (req, res) => {
<<<<<<< HEAD
    const idToken = req.body.idToken;
=======
    let idToken = req.params.idToken;
>>>>>>> adding-authentication

    const verificationResult = await authenticationServices.verifyGoogleToken(idToken);

    if (verificationResult.success) {
<<<<<<< HEAD
        const result = await userServices.findUnregistredOrCreateUser(verificationResult.ticket);
        if (result.success) {
            res.status(200).json({ success: true, user: result.user });
        }else{
            res.status(401).json({ success: false, error: result.error });
        }
    } else {
        res.status(401).json({ success: false, error: verificationResult.error });
=======
        // TODO: Add user to the database
        res.status(200).json({ success: true, userId: verificationResult.email});
    } else {
        res.status(401).json({ success: false, message: verificationResult.error });
>>>>>>> adding-authentication
    }
};
