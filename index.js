const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controller/errorController");

const app = express();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "developmemt") {
    app.use(morgan("dev"));
}

app.use((req, res, next) => {
    // console.log(req.cookies);

    next();
});

const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

require("./routes")(app);

app.use(globalErrorHandler);

module.exports = app;
