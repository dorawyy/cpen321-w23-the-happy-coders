const googleCalendarService = require('../services/googleCalendarService');

exports.createEvent = async (req, res) => {
    let authCode = req.params.authCode;
    console.log(authCode);
    const verificationResult = await googleCalendarService.createEvent(authCode, {});
}