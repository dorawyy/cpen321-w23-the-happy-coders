const { User } = require('../models/user');
const googleCalendarService = require('../services/googleCalendarService');

//ChatGPT Usage: No
exports.createEvent = async (req, res) => {
    const authCode = req.body.authCode;
    const event = req.body.event;
    
    const verificationResult = await googleCalendarService.createEvent(authCode, event);
    if (verificationResult.success) {
        res.status(200).json({ success: true, message: "Event Created" });
    } else {
        res.status(401).json({ success: false, error: verificationResult.error });
    }
}

exports.getEvents = async (req, res) => {
    const hostUserId = req.params.hostUserId;
    const invitedUserId = req.params.invitedUserId;
    
    // Check User validity
    try{
        User.findById(hostUserId);
        if(invitedUserId){
            User.findById(invitedUserId);
        }
    }catch(error){
        res.status(401).json({ success: false, error: 'Error finding host or invited user' });
        return;
    }

    var verificationResult;
    if (invitedUserId) {
        verificationResult = await googleCalendarService.getEvents(hostUserId, invitedUserId);
    } else {
        verificationResult = await googleCalendarService.getEvents(hostUserId, null);
    }
    if (verificationResult.success) {
        res.status(200).json({ success: true, events: verificationResult.events });
    } else {
        res.status(401).json({ success: false, error: verificationResult.error });
    }
}