const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// Optional: Middleware to check if user is super_admin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super admin privileges required.",
    });
  }
  next();
};

// Optional: Middleware to check if user is admin or super_admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

module.exports = { verifyToken, isSuperAdmin, isAdmin };
