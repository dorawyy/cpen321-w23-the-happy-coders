require('dotenv').config()
const {Report} = require('../models/report');
const { User } = require('../models/user');
const userService = require('./userService');

//ChatGPT Usage: No
// Adds a new report
async function addReport(reportData){
    const reporterUserId = reportData.reporterUserId;
    const reportedUserId = reportData.reportedUserId;
    const chatRoomId = reportData.chatRoomId;
    const reportMessage = reportData.Report;

    const reporterUser = await User.findById(reportData.reporterdUserId)
    const reportedUser = await User.findById(reportData.reportedUserId)

    const report = new Report({
        reporterUserId: reporterUserId,
        reportedUserId: reportedUserId,
        chatRoomId: chatRoomId,
        reportMessage: reportMessage
    });

    reporterUser.blockedUsers.push(reportData.reportedUserId)

    reporterUser.matchedUsers.filter(matchedUserId => matchedUserId != reportedUserId)
    reporterUser.likedUsers.filter(likedUserId => likedUserId != reportedUserId)
    reporterUser.chatroomIDs.filter(chatroomId => chatroomId != chatRoomId)

    reportedUser.matchedUsers.filter(matchedUserId => matchedUserId != reporterUserId)
    reportedUser.likedUsers.filter(likedUserId => likedUserId != reporterUserId)
    reportedUser.chatroomIDs.filter(chatroomId => chatroomId != chatRoomId)

    await report.save();
    await reportedUser.save();
    await reporterUser.save()

    return report;
}


//ChatGPT Usage: No
// Gets all open reports for an admin
async function getReports() {
    const reports = await Report.find();
    return reports;
}


//ChatGPT Usage: No
// Deletes a report after an admin has reviewed it
async function deleteReport(reportId) {
    const report = await Report.findByIdAndDelete(reportId);
    return report;
}


//ChatGPT Usage: No
// Bans a user 
async function ban(userId) {
    return userService.banUser(userId);
}

async function isAdmin(adminId) {
    const admin = await User.findById(adminId);

    if (!admin) {
        return false;
    }
    
    return admin.admin;
}

module.exports = { addReport, getReports, deleteReport, ban, isAdmin }