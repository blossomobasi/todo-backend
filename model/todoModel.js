const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Todo must belong to a user"],
    },
    reminder: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

todoSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "username email",
    });

    next();
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
