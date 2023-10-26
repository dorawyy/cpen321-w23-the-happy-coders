const { OAuth2Client } = require('google-auth-library');
require('dotenv').config()

const client = new OAuth2Client(process.env.CLIENT_ID);

// Verifies that the tokens retrieved from login and sign up are valid
async function verifyGoogleToken(idToken) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        // TODO: Determine what info to return to the front-end
        const email = payload.email;

        return { success: true, email };
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return { success: false, error: 'Token verification failed' };
    }
}

module.exports = {verifyGoogleToken};