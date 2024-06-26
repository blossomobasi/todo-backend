const User = require("../model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
};

const getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new AppError("The user with the given ID was not found!", 404));

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

const createUser = catchAsync(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    res.status(201).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, email, password },
        {
            new: true,
            runValidators: true,
        }
    );
    if (!updatedUser) return next(new AppError("The user with the given ID was not found!", 404));

    res.status(200).json({
        status: "success",
        data: {
            updatedUser,
        },
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return next(new AppError("The user with the given ID was not found!", 404));

    res.status(204).json({
        status: "success",
        data: null,
    });
});

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
