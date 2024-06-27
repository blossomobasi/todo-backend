const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const globalErrorHandler = require("./controller/errorController");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "developmemt") {
    app.use(morgan("dev"));
}

const corsOptions = {
    origin: "*",
    // process.env.NODE_ENV === "production"
    //     ? [process.env.FRONTEND_BASE_URL, "http://localhost:3000"]
    //     : "*",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

require("./routes")(app);

app.use(globalErrorHandler);

module.exports = app;
