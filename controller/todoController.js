const Todo = require("../model/todoModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllTodos = catchAsync(async (req, res) => {
    const todos = await Todo.find();

    res.status(200).json({
        status: "success",
        results: todos.length,
        data: {
            todos,
        },
    });
});

const getTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return next(new AppError("The todo with the given ID was not found", 404));

    res.status(200).json({
        status: "success",
        data: {
            todo,
        },
    });
});

const getUserTodos = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const userTodos = await Todo.find({ user: userId });

    if (!userTodos) return next(new AppError("The todo with the given ID was not found", 404));

    res.status(200).json({
        status: "success",
        results: userTodos.length,
        data: {
            todos: userTodos,
        },
    });
});

const createTodo = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const { description, completed, reminder } = req.body;

    const newTodo = await Todo.create({ description, completed, reminder, user: userId });

    res.status(201).json({
        status: "success",
        data: {
            todo: newTodo,
        },
    });
});

const updateTodo = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const todoId = req.params.id;

    const { description, completed, reminder } = req.body;

    const todo = await Todo.findOneAndUpdate(
        { _id: todoId, user: userId },
        { description, completed, reminder },
        { new: true, runValidators: true }
    );

    if (!todo) return next(new AppError("The todo with the given ID was not found", 404));

    res.status(200).json({
        status: "success",
        data: {
            todo,
        },
    });
});

const deleteTodo = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const todoId = req.params.id;

    const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });

    if (!todo) return next(new AppError("The todo with the given ID was not found", 404));

    res.status(204).json({
        status: "success",
        data: null,
    });
});

module.exports = { getAllTodos, getTodo, getUserTodos, createTodo, updateTodo, deleteTodo };
