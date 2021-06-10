function errorHandler(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ message: "The user is not authorized" });
    }
    if (err.name === "ValidationError") {
        return res.status(401).json({ message: err });
    }

    res.status(500).json({ message: "Server error occurred" });
}

module.exports = errorHandler;
