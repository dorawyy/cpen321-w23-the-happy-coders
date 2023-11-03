require('dotenv').config();
const moderationService = require('../services/moderationService');
const userService = require('../services/userService');

// ChatGPT Usage: No
// Route for users to add a report
exports.addReport = async (req, res) => {
    try {
        console.log(req.body);
        await moderationService.addReport(req.body);

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while adding a report" });
    }
}

// ChatGPT Usage: No
// Route for admins to get all reports
exports.getReports = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (moderationService.isAdmin(adminId)) {
            let reports = await moderationService.getReports();
            console.log(reports);
            return res.status(200).json({ success: true, reports: reports });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access to admin actions" })
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: "Error while fetching reports: " + err });
    }
}

// ChatGPT Usage: No
// Route for admins to delete a report
exports.deleteReport = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (moderationService.isAdmin(adminId)) {
            const reportId = req.params.reportId;
            await moderationService.deleteReport(reportId);

            return res.status(200).json({ success: true });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access to admin actions" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while deleting report" + error });
    }
}

// ChatGPT Usage: No
// Route for admins to ban a user
exports.banUser = async (req, res) => {
    try {
        console.log("Banned body: " + req.body.userId);
        const adminId = req.params.adminId;
        if (moderationService.isAdmin(adminId)) {
            const userId = req.body.userId;
            const reportId = req.body.reportId;

            await moderationService.ban(userId);
            await moderationService.deleteReport(reportId);
            
            return res.status(200).json({ success: true });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access to admin actions" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while banning user" });
    }
}
