const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");
const usercontroller = new UserController();

router.post("/", usercontroller.signup);
router.post("/login", usercontroller.login);

module.exports = router;