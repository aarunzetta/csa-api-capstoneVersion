const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/authMiddleware");

// GET /api/dashboard/stats - Get dashboard statistics (protected route)
router.get("/stats", verifyToken, getDashboardStats);

module.exports = router;
