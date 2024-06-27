const express = require("express");
const helmet = require("helmet");
const mongoSanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controller/errorController");

const app = express();

if (process.env.NODE_ENV === "developmemt") {
    app.use(morgan("dev"));
}

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitizer());

// Data sanitization against XSS
app.use(xss());

app.use((req, res, next) => {
    // console.log(req.cookies);

    next();
});

// CORS
const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ROUTES
require("./routes")(app);

// GLOBAL ERROR MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
