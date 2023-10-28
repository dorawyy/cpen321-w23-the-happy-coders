var express = require("express");
var router = express.Router();
var usersController = require("../controllers/usersController");


// Creates a new user
router.post("/create", usersController.createUser);

// Updates the preferences for a user
router.put("/updateProfile/:id", usersController.updateUserProfile);
// Adds a new match for a user
router.put("/updateMatches/:id", usersController.updateMatchedUsers);
// Adds a new blocked user for a user
router.put("/updateBlocks/:id", usersController.updateBlockedUsers);
// Adds a new like for a user
router.put("/updateLikes/:id", usersController.updateLikedUsers);
// Adds a new badge for a user
router.put("/updateBadges/:id", usersController.updateBadges);

// Returns a user's data
router.get("/get/:id", usersController.getUser);


module.exports = router;
