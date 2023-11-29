const { User } = require('../models/user');
const eventService = require('../services/eventService');

//ChatGPT Usage: No
exports.createEvent = async (req, res) => {
    const authCode = req.body.authCode;
    const event = req.body.event;
    
    const verificationResult = await eventService.createEvent(authCode, event);
    if (verificationResult.success) {
        res.status(200).json({ success: true, message: "Event Created" });
    } else {
        res.status(401).json({ success: false, error: verificationResult.error });
    }
}

// ChatGPT Usage: No
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
        verificationResult = await eventService.getEvents(hostUserId, invitedUserId);
    } else {
        verificationResult = await eventService.getEvents(hostUserId, null);
    }
    if (verificationResult.success) {
        res.status(200).json({ success: true, events: verificationResult.events });
    } else {
        res.status(401).json({ success: false, error: verificationResult.error });
    }
}

// ChatGPT Usage: No
exports.deleteEvent = async (req, res) => {
    const authCode = req.body.authCode;
    const userId = req.body.userId;
    const eventId = req.params.eventId;

    const verificationResult = await eventService.deleteEvent(authCode, userId, eventId);
    if (verificationResult.success) {
        res.status(200).json({ success: true, message: verificationResult.message});
    } else {
        res.status(401).json({ success: false, error: verificationResult.error });
    }
}
