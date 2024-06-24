const express = require("express");
const morgan = require("morgan");

const app = express();

require("./routes")(app);

if (process.env.NODE_ENV === "developmemt") {
    app.use(morgan("dev"));
}

module.exports = app;
