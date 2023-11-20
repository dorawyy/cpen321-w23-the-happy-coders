const agoraTokenService = require('../services/agoraTokenService'); 
const { RtcRole } = require('agora-access-token');
require('dotenv').config();

//ChatGPT Usage: No
// Adapted from https://www.agora.io/en/blog/how-to-build-a-token-server-for-agora-applications-using-nodejs/
exports.getRTCToken = async (req, resp) => { 
    resp.header('Access-Control-Allow-Origin', '*');
    const channelName = req.params.channel;
    if (!channelName || !channelName.replace(/\s/g, '').length) {
        return resp.status(400).json({ 'error': 'channel is required' });
    }

    let uid = req.params.uid;
    // get role
    let role;
    if (req.params.role === 'publisher') {
        role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
        role = RtcRole.SUBSCRIBER
    } else {
        return resp.status(400).json({ 'error': 'role is incorrect' });
    }

    // set token expiration time
    const expireTime = 3600;

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    // get token type
    const tokenType = req.params.tokentype 
    if(tokenType !== 'uid' && tokenType !== 'userAccount') { 
        return resp.status(400).json({ 'error': 'token type is incorrect' });
    }

    const token = agoraTokenService.generateToken(channelName, uid, role, privilegeExpireTime, tokenType);

    return resp.json({ 'agoraToken': token });
};