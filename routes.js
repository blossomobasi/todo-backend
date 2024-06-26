const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");

module.exports = function (app) {
    app.get("/", (req, res) => {
        res.status(200).json({
            status: "success",
            message: "TODO APPLICATION",
            version: "1.0.0",
        });
    });
    app.use("/api/v1/users", userRouter);

    app.all("*", (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });
};
