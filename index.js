const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./controller/errorController");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "developmemt") {
    app.use(morgan("dev"));
}

require("./routes")(app);

app.use(globalErrorHandler);

module.exports = app;
