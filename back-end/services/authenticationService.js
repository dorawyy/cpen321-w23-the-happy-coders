const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
require('dotenv').config();
const {User} = require('../models/user');

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
async function retrieveAccessToken(authorizationCode, userId) {
    let access_token;
    try {
        const user = await User.findById(userId);
        console.log(user);

        if (!user) {
            const returnObj = { success: false, error: 'Error finding host or invited user' };
            return returnObj;
        }

        // Check if user has tokens saved and if they are not expired
        if (user.tokens && user.tokens.accessToken  && user.tokens.expiresAt > Date.now()) {
            console.log("Using saved token");
            access_token = user.tokens.accessToken;
        } else if(user.tokens && user.tokens.refreshToken ){
             // If tokens are expired
            const { tokens } = await client.refreshToken(user.tokens.refreshToken);
            console.log("Refreshing token");
            // Update user's access token and expiration date
            user.tokens.accessToken = tokens.access_token;
            user.tokens.expiresAt = tokens.expiry_date; 
            access_token = tokens.access_token;
        }else{
            // If this is the first sign in, retrieve tokens from authorization code
            const { tokens } = await client.getToken(authorizationCode);
            console.log("Getting token");
            // Save the tokens to the user document
            user.tokens.accessToken = tokens.access_token;
            user.tokens.refreshToken = tokens.refresh_token;
            user.tokens.expiresAt = tokens.expiry_date;
            access_token = tokens.access_token;
        }

        await user.save();
        const returnObj = { success: true, access_token };
        return returnObj;
    } catch (error) {
        console.error('Error retrieving or updating tokens:', error);
        const returnObj = { success: false,  error: error.message };
        return returnObj;
    }
}

//ChatGPT Usage: No
// Use authorization code to get new authorized Google Client
async function getGoogleClient(authCode, userId ){
    const tokensResponse = await retrieveAccessToken(authCode, userId);

    if(!tokensResponse.success) {
        return tokensResponse;
    }

    const acccessToken  = tokensResponse.access_token;
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

module.exports = { verifyGoogleToken, retrieveAccessToken, getGoogleClient };
