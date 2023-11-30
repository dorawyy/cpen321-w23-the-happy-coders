const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporterUserId: String,
    reportedUserId: String,
    reportedUserName: String,
    chatRoomId: String,
    reportMessage: String
});

const Report = mongoose.model('Report', reportSchema);

module.exports = {Report};