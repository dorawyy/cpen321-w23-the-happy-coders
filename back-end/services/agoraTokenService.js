const { RtcTokenBuilder } = require('agora-access-token');

// ChatGPT Usage: No
// Adapted from https://www.agora.io/en/blog/how-to-build-a-token-server-for-agora-applications-using-nodejs/
// Generate RTC token for agora, so that users can join a channel
exports.generateToken = (channelName, uid, role, privilegeExpireTime, tokenType) => {
    let token;
    if (tokenType === 'userAccount') {
        token = RtcTokenBuilder.buildTokenWithAccount(process.env.APP_ID, process.env.APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else{
        token = RtcTokenBuilder.buildTokenWithUid(process.env.APP_ID, process.env.APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } 
    return token;
}

