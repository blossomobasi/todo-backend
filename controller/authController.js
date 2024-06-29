const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

function signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

function createSendToken(res, statusCode, user) {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    };

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
}

const signup = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    const newUser = await User.create({
        username,
        email,
        password,
    });

    createSendToken(res, 201, newUser);
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError("Please Provide email and password!", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    createSendToken(res, 200, user);
});

const protect = catchAsync(async (req, res, next) => {
    let token;

    // Check if token exists
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) return next(new AppError("You are not logged in! Log in to get Access", 401)); // Unauthorized

    // Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user)
        return next(new AppError("The user belonging to the token does not longer exit!", 401));

    req.user = user;

    // GRANT ACCESS TO PROTECTED ROUTE
    next();
});

module.exports = { signup, login, protect };
