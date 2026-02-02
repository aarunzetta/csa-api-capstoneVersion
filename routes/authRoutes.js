const express = require("express");
const router = express.Router();
const { login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { loginSchema } = require("../validators/authValidator");

// POST /api/auth/login - Login endpoint
router.post("/login", validate(loginSchema), login);

// GET /api/auth/me - Get current logged-in admin (protected route)
router.get("/me", verifyToken, getMe);

module.exports = router;
