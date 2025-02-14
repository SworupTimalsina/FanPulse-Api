const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }

  try {
    // Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }
});

// Grant access to specific roles (e.g., admin, publisher)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "User role is not defined." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role "${req.user.role}" is not authorized to access this route.`,
      });
    }

    next();
  };
};
