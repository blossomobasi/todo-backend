const Todo = require("../model/todoModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllTodos = catchAsync(async (req, res, next) => {
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

const createTodo = catchAsync(async (req, res, next) => {
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
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!todo) return next(new AppError("The todo with the given ID was not found", 404));

    res.status(200).json({
        status: "success",
        data: {
            todo,
        },
    });
});

const deleteTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) return next(new AppError("The todo with the given ID was not found", 404));

    res.status(204).json({
        status: "success",
        data: null,
    });
});

module.exports = { getAllTodos, getTodo, createTodo, updateTodo, deleteTodo };
