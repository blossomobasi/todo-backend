const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "developmemt") {
    app.use(morgan("dev"));
}

require("./routes")(app);

module.exports = app;
