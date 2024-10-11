const mongoose = require('mongoose')
const express = require("express");
const helmet = require("helmet");
const mongoSanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controller/errorController");

const app = express();

if (process.env.NODE_ENV === "development") {
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
    origin:
        process.env.NODE_ENV === "production"
            ? process.env.FRONTEND_PROD_URL
            : process.env.FRONTEND_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ROUTES
require("./routes")(app);

// GLOBAL ERROR MIDDLEWARE
app.use(globalErrorHandler);

let isConnectedBefore = false;
const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

async function connectToDatabase() {
  if (!isConnectedBefore) {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB Successfully connected.');
    isConnectedBefore = true;
  }
}

// Vercel Serverless Function Handler
module.exports = async (req, res) => {
    await connectToDatabase(); // Ensure MongoDB is connected before handling any requests
    app(req, res); // Pass the request to Express
  };


module.exports = app;
