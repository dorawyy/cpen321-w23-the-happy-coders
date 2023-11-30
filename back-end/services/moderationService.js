require('dotenv').config()
const {Report} = require('../models/report');
const { User } = require('../models/user');
const userService = require('./userService');

//ChatGPT Usage: No
// Adds a new report
async function addReport(reportData){
    let report;
    if (reportData.reporterUserId == null || reportData.reportedUserId == null || reportData.chatRoomId == null || reportData.reportMessage == null){
        const returnObj = {success: false, error: "Missing report data"};
        return returnObj;
    }
    const reporterUserId = reportData.reporterUserId;
    const reportedUserId = reportData.reportedUserId;
    const chatRoomId = reportData.chatRoomId;
    const reportMessage = reportData.reportMessage;
    
    const reporterUser = await User.findById(reportData.reporterUserId);
    const reportedUser = await User.findById(reportData.reportedUserId);

    if (!reporterUser || !reportedUser) {
        const returnObj = {success: false, error: "User not found"};
        return returnObj;
    }

    report = new Report({
        reporterUserId,
        reportedUserId,
        reportedUserName: reportedUser.displayName,
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

    const returnObj = {success: true, report};
    return returnObj;
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