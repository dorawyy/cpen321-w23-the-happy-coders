var express = require("express");
var router = express.Router();
var usersController = require("../controllers/usersController");


// Creates a new user
router.post("/users", usersController.createUser);
// Updates the preferences for a user
router.put("/users/:id/prefs", usersController.updateUserProfile);
// Adds a new blocked user for a user
router.put("/users/:id/blocked", usersController.updateBlockedUsers);
// Adds a new badge for a user
router.put("/users/:id/badges", usersController.updateBadges);
// Returns a user's data
router.get("/users/:id", usersController.getUser);


module.exports = router;
