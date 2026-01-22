const express = require("express");
const router = express.Router();
const {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
} = require("../controllers/passengerController");
const { verifyToken } = require("../middleware/authMiddleware");

// All routes are protected - require authentication
router.use(verifyToken);

// GET /api/passengers - Get all passengers
router.get("/", getAllPassengers);

// GET /api/passengers/:id - Get single passenger
router.get("/:id", getPassengerById);

// POST /api/passengers - Create new passenger
router.post("/", createPassenger);

// PUT /api/passengers/:id - Update passenger
router.put("/:id", updatePassenger);

// DELETE /api/passengers/:id - Delete passenger
router.delete("/:id", deletePassenger);

module.exports = router;
