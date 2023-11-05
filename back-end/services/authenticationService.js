const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
require('dotenv').config();

const client = new OAuth2Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

// ChatGPT Usage: No
// Verifies that the tokens retrieved from login and sign up are valid
async function verifyGoogleToken(idToken) {
    let response;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,
        });        
        response = { success: true, ticket };
        return response;
    } catch (error) {
        console.error('Error verifying Google token:', error);
        response = { success: false, error: 'Token verification failed' };
        return response;
    }
}

//ChatGPT Usage: No
// Retrieves the access token and refresh token from the authorization code
async function retrieveTokens(authorizationCode) {
    let response;
    try {
        const { tokens } = await client.getToken(authorizationCode);
        response = { success: true, tokens };
        return response;
    } catch (error) {
        console.error('Error retrieving access code:', error);
        response = { success: false, error: 'Access code retrieval failed' };
        return response;
    }
}

//ChatGPT Usage: No
// Use authorization code to get new authorized Google Client
async function getGoogleClient(authCode){
    const tokensResponse = await retrieveTokens(authCode);

    if(!tokensResponse.success) {
        return tokensResponse;
    }

    const acccessToken  = tokensResponse.tokens.access_token;


    const auth = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
    );

    auth.setCredentials({
        access_token: acccessToken,
    });

    let response = {success: true, auth}
    return response;
}

module.exports = { verifyGoogleToken, retrieveTokens, getGoogleClient };
