require('dotenv').config()
const {Report} = require('../models/report');
const { User } = require('../models/user');
const userService = require('./userService');

//ChatGPT Usage: No
// Adds a new report
async function addReport(reportData){
    const report = new Report({
        reporterUserId: reportData.reporterUserId,
        reportedUserId: reportData.reportedUserId,
        chatRoomId: reportData.chatRoomId,
        report: reportData.report
    });

    await report.save();

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