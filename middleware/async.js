const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error("Async Error:", err.message); // Logs error for debugging
        next(err);
    });
};

module.exports = asyncHandler;
