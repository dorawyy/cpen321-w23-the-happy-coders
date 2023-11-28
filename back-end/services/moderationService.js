require('dotenv').config()
const {Report} = require('../models/report');
const { User } = require('../models/user');
const userService = require('./userService');

//ChatGPT Usage: No
// Adds a new report
async function addReport(reportData){
    let report;
    if (reportData.reporterUserId == null || reportData.reportedUserId == null || reportData.chatRoomId == null || reportData.reportMessage == null){
        return {success: false, error: "Missing report data"};
    }
    const reporterUserId = reportData.reporterUserId;
    const reportedUserId = reportData.reportedUserId;
    const chatRoomId = reportData.chatRoomId;
    const reportMessage = reportData.reportMessage;
    
    const reporterUser = await User.findById(reportData.reporterUserId);
    const reportedUser = await User.findById(reportData.reportedUserId);

    if (!reporterUser || !reportedUser) {
        return {success: false, error: "User not found"};
    }

    report = new Report({
        reporterUserId,
        reportedUserId,
        chatRoomId,
        reportMessage
    });
    
    reporterUser.blockedUsers.push(reportedUserId);   
    reporterUser.matchedUsers = reporterUser.matchedUsers.filter(matchedUserId => matchedUserId != reportedUserId);
    reporterUser.likedUsers = reporterUser.likedUsers.filter(likedUserId => likedUserId != reportedUserId);
    reporterUser.chatroomIDs = reporterUser.chatroomIDs.filter(chatroomId => chatroomId != chatRoomId);

    reportedUser.matchedUsers = reportedUser.matchedUsers.filter(matchedUserId => matchedUserId != reporterUserId);
    reportedUser.likedUsers = reportedUser.likedUsers.filter(likedUserId => likedUserId != reporterUserId);
    reportedUser.chatroomIDs = reportedUser.chatroomIDs.filter(chatroomId => chatroomId != chatRoomId);
    
    await report.save();
    await reportedUser.save();
    await reporterUser.save();

    return {success: true, report};
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

    if (admin) {
        return admin.admin;
    }
    
    return false;
}

module.exports = { addReport, getReports, deleteReport, ban, isAdmin }