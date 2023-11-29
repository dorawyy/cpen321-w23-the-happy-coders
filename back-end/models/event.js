// ChatGPT Usage: Partial
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    hostUserId: String,
    invitedUserId: String,
    googleEventId: String,
    startTime: Date,
    endTime: Date,
    chatroomId: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {Event};
