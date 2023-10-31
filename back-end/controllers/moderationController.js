require('dotenv').config();
const moderationService = require('../services/moderationService');
const userService = require('../services/userService');


exports.makeAdmin = async (req, res) => {
    try {
        let adminId = req.params.adminId;
        if (adminServices.isAdmin(adminId)) {
            let userEmail = req.body.email;
            let result = await userService.makeAdmin(userEmail);

            if (result.success) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(400).json({ success: false, error: result.error });
            }
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access to admin actions" })
        }
    } catch {
        return res.status(500).json({ success: false, error: "Error while making a new admin" });
    }
}

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
        let adminId = req.params.adminId;
        if (adminServices.isAdmin(adminId)) {
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
        let adminId = req.params.adminId;
        if (adminServices.isAdmin(adminId)) {
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
        let adminId = req.params.adminId;
        if (adminServices.isAdmin(adminId)) {
            const userId = req.params.id;
            return await moderationService.ban(userId);
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access to admin actions" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Error while banning user" });
    }
}
