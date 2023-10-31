require('dotenv').config()
const {Report} = require('../models/report');
const userService = require('./userService');


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


// Gets all open reports for an admin
async function getReports(){
    const reports = await Report.find();
    return reports;
}


// Deletes a report after an admin has reviewed it
async function deleteReport(reportId){
    const report = await Report.findByIdAndDelete(reportId);
    return report;
}


// Bans a user 
async function ban(userId){
    return userService.banUser(userId);
}


module.exports = { addReport, getReports, deleteReport, ban }