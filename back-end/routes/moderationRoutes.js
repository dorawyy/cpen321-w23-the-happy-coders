var express = require("express");
var router = express.Router();
var moderationController = require("../controllers/moderationController");


// Returns all reports
router.get("/:adminId", moderationController.getReports);

// Adds a new report
router.post("/", moderationController.addReport);

// Creates a new admin user (body contains the email of the user to be made an admin)
router.post("/:adminId/make-admin", moderationController.makeAdmin);

// Bans a given user
router.put("/:adminId/:userId/ban", moderationController.banUser);

// Deletes a report
router.delete("/:adminId/:reportId", moderationController.deleteReport);


module.exports = router;