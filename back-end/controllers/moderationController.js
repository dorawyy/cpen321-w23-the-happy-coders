require('dotenv').config();
const moderationService = require('../services/moderationService');
const userService = require('../services/userService');


exports.addReport = async (req, res) => {
    try {
        await moderationService.addReport(req.body);

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while adding a report" });
    }
}

exports.getReports = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (moderationService.isAdmin(adminId)) {
            await moderationService.getReports();

            return res.status(200).json({ success: true, reports: reports });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access to admin actions" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while fetching reports" });
    }
}

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
        return res.status(500).json({ success: false, error: "Error while deleting report" });
    }
}

exports.banUser = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (moderationService.isAdmin(adminId)) {
            const userId = req.params.id;
            return await moderationService.ban(userId);
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access to admin actions" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while banning user" });
    }
}
