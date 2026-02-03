const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createAdminSchema,
  updateAdminSchema,
} = require("../validators/adminValidator");

// All routes are protected - require authentication
router.use(verifyToken);

// GET /api/admins - Get all admins
router.get("/", getAllAdmins);

// GET /api/admins/:id - Get single admin
router.get("/:id", getAdminById);

// POST /api/admins - Create new admin (with validation)
router.post("/", validate(createAdminSchema), createAdmin);

// PUT /api/admins/:id - Update admin (with validation)
router.put("/:id", validate(updateAdminSchema), updateAdmin);

// DELETE /api/admins/:id - Delete admin
router.delete("/:id", deleteAdmin);

module.exports = router;
