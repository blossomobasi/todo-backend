const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const router = express.Router();

// Auth
router.route("/me").get(authController.protect, userController.getMe);
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

// Users
router
    .route("/")
    .get(userController.getAllUsers)
    .post(authController.protect, userController.createUser);

router
    .route("/:id")
    .get(userController.getUser)
    .put(authController.protect, userController.updateUser)
    .delete(authController.protect, userController.deleteUser);

module.exports = router;
