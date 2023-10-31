const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporterUserId: String,
    reportedUserId: String,
    chatRoomId: String,
    report: String
});

const Report = mongoose.model('Report', reportSchema);

module.exports = {Report};