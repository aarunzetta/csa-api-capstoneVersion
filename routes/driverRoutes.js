const express = require("express");
const router = express.Router();
const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");
const { verifyToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createDriverSchema,
  updateDriverSchema,
} = require("../validators/driverValidator");

// All routes are protected - require authentication
router.use(verifyToken);

// GET /api/drivers - Get all drivers
router.get("/", getAllDrivers);

// GET /api/drivers/:id - Get single driver
router.get("/:id", getDriverById);

// POST /api/drivers - Create new driver (with validation)
router.post("/", validate(createDriverSchema), createDriver);

// PUT /api/drivers/:id - Update driver (with validation)
router.put("/:id", validate(updateDriverSchema), updateDriver);

// DELETE /api/drivers/:id - Delete driver
router.delete("/:id", deleteDriver);

module.exports = router;
