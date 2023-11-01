const authenticationServices = require('../services/authenticationService');
const userServices = require('../services/userService');

//ChatGPT Usage: No
exports.handleLogin = async (req, res) => {
    const idToken = req.body.idToken;
    console.log("Login with token " + idToken);

    const verificationResult = await authenticationServices.verifyGoogleToken(idToken);

    if (verificationResult.success) {
        console.log("Verification successful");
        const payload = verificationResult.ticket.getPayload();
        const result = await userServices.findUserByEmail(payload.email);
        if (result.success) {
            console.log("User found");
            res.status(200).json({ success: true, userId: result.user._id });
        }else{
            console.log("User not found");
            res.status(401).json(result);
        }
    } else {
        console.log("Verification failed");
        res.status(401).json({ success: false, message: verificationResult.error });
    }
};

exports.handleAdminLogin = async (req, res) => {
    const accessCode = req.body.accessCode;
    const email = req.body.email;
    console.log("Admin login with access code " + accessCode + " and email " + email);

    if (accessCode === process.env.ADMIN_ACCESS_CODE) {
        const result = await userServices.findAdminOrCreate(email);
        if (result.success) {
            res.status(200).json({ success: true, userId: result.user._id });
        } else {
            res.status(401).json({ success: false, error: result.error });
        }
    } else {
        res.status(401).json({ success: false, error: "Invalid access code" });
    }
}


//ChatGPT Usage: No
exports.handleSignup = async (req, res) => {
    const idToken = req.body.idToken;

    const verificationResult = await authenticationServices.verifyGoogleToken(idToken);

    if (verificationResult.success) {
        const result = await userServices.findUnregistredOrCreateUser(verificationResult.ticket);
        if (result.success) {
            res.status(200).json({ success: true, userId: result.user._id });
        }else{
            res.status(401).json({ success: false, error: result.error });
        }
    } else {
        res.status(401).json({ success: false, error: verificationResult.error });
    }
};
