const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required."],
        minlength: [3, "First name must be at least 3 characters."],
        maxlength: [50, "First name must not be more than 50 characters."],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required."],
        minlength: [3, "Last name must be at least 3 characters."],
        maxlength: [50, "Last name must not be more than 50 characters."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please provide a valid email."], // Regular expression for email validation
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        min: [8, "Password must be at least 8 characters."],
        select: false, // This will prevent the password from showing up in any output
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }

    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
