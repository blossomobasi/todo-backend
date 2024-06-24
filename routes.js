module.exports = function (app) {
    app.get("/", (req, res) => {
        res.status(200).json({
            status: "success",
            message: "TODO APPLICATION",
            version: "1.0.0",
        });
    });

    app.all("*", (req, res) => {
        res.status(404).json({
            status: "fail",
            message: `Can't find ${req.originalUrl} on this server`,
        });
    });
};
