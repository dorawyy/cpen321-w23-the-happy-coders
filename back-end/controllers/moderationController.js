require('dotenv').config();
const moderationService = require('../services/moderationService');

// ChatGPT Usage: No
// Route for users to add a report
exports.addReport = async (req, res) => {
    const requestBody = req.body;
    try {
        const addReportResponse = await moderationService.addReport(requestBody);
        if (addReportResponse.success) {
            return res.status(200).json({ success: true, message: "Report saved successfully" });
        }
        return res.status(400).json({ success: false, error: "Invalid report" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while adding a report" });
    }
}

// ChatGPT Usage: No
// Route for admins to get all reports
exports.getReports = async (req, res) => {
    let reports;
    try {
        const adminId = req.params.adminId;
        const isAdmin = await moderationService.isAdmin(adminId);
        if (isAdmin) {
            reports = await moderationService.getReports();
            return res.status(200).json({ success: true, reports });
        } else {
            return res.status(400).json({ success: false, error: "Unauthorized access to admin actions" })
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: "Error getting reports" });
    }
}

// ChatGPT Usage: No
// Route for admins to delete a report
exports.deleteReport = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (await moderationService.isAdmin(adminId)) {
            const reportId = req.params.reportId;
            let report = await moderationService.deleteReport(reportId);
            if (report == null) {
                return res.status(400).json({ success: false, error: "Report not found" });
            }

            return res.status(200).json({ success: true, message: "Report deleted successfully" });
        } else {
            return res.status(400).json({ success: false, error: "Unauthorized access to admin actions" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while deleting report"});
    }
}

// ChatGPT Usage: No
// Route for admins to ban a user
exports.banUser = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (await moderationService.isAdmin(adminId)) {
            const userId = req.body.userId;
            const reportId = req.body.reportId;

            let response1 =  await moderationService.ban(userId);

            if (!response1.success) {
                return res.status(400).json({ success: false, error: "Invalid user id" });
            }

            let response2 = await moderationService.deleteReport(reportId);

            if (response2 == null) {
                return res.status(400).json({ success: false, error: "Report not found" });
            }
            
            return res.status(200).json({ success: true , message: "User banned successfully"});
        } else {
            return res.status(400).json({ success: false, error: "Unauthorized access to admin actions" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while banning user" });
    }
}
