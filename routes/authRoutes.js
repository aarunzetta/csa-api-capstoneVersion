const express = require("express");
const router = express.Router();
const { login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/auth/login - Login endpoint
router.post("/login", login);

// GET /api/auth/me - Get current logged-in admin (protected route)
router.get("/me", verifyToken, getMe);

module.exports = router;
