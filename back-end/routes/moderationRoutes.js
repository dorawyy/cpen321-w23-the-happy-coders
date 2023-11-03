var express = require("express");
var router = express.Router();
var moderationController = require("../controllers/moderationController");


// Returns all reports
router.get("/:adminId", moderationController.getReports);

// Adds a new report
router.post("/", moderationController.addReport);

// Bans a given user
router.put("/:adminId/ban", moderationController.banUser);

// Deletes a report
router.delete("/:adminId", moderationController.deleteReport);


module.exports = router;