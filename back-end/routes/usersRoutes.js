var express = require("express");
var router = express.Router();
var usersController = require("../controllers/usersController");

router.post("/create", usersController.createUser);
router.put("/update/:id", usersController.updateUser);
router.get("/get/:id", usersController.getUser);
router.get("/getFiltered", usersController.getFilteredUser);

module.exports = router;
