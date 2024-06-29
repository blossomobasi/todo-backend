const express = require("express");
const todoController = require("../controller/todoController");
const authController = require("../controller/authController");

const router = express.Router();

router.route("/mytodos").get(authController.protect, todoController.getUserTodos);

router
    .route("/")
    .get(todoController.getAllTodos)
    .post(authController.protect, todoController.createTodo);

router
    .route("/:id")
    .get(todoController.getTodo)
    .patch(authController.protect, todoController.updateTodo)
    .delete(authController.protect, todoController.deleteTodo);

module.exports = router;
