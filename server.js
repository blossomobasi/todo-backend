const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require("./index");

// DATABASE CONNECTION
const DB = process.env.DB_URL.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
    .connect(DB)
    .then(() => console.log("DB Successfully connected."))
    .catch((err) => console.log(err));

// PORT
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});
