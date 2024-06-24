const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.route("/").get(userController.getAllUsers).post(userController.createUser);
router.route("/:id").put(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
