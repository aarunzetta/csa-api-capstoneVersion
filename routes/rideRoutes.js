const express = require("express");
const router = express.Router();
const {
  getAllRides,
  getRideById,
  createRide,
  deleteRide,
} = require("../controllers/rideController");
const { verifyToken } = require("../middleware/authMiddleware");

// All routes are protected - require authentication
router.use(verifyToken);

// GET /api/rides - Get all rides
router.get("/", getAllRides);

// GET /api/rides/:id - Get single ride
router.get("/:id", getRideById);

// POST /api/rides - Create new ride (for testing)
router.post("/", createRide);

// DELETE /api/rides/:id - Delete ride
router.delete("/:id", deleteRide);

module.exports = router;
