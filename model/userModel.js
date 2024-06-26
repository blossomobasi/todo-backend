const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required."],
        unique: true,
        minlength: [3, "username must be at least 3 characters."],
        maxlength: [50, "username must not be more than 50 characters."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required."],
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please provide a valid email."], // Regular expression for email validation
    },
    password: {
        type: String,
        required: [true, "password is required."],
        min: [8, "password must be at least 8 characters."],
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

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
