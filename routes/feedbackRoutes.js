const express = require("express");
const router = express.Router();
const {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");
const { verifyToken } = require("../middleware/authMiddleware");

// All routes are protected - require authentication
router.use(verifyToken);

// GET /api/feedbacks - Get all feedbacks
router.get("/", getAllFeedbacks);

// GET /api/feedbacks/:id - Get single feedback
router.get("/:id", getFeedbackById);

// POST /api/feedbacks - Create new feedback (for testing)
router.post("/", createFeedback);

// DELETE /api/feedbacks/:id - Delete feedback
router.delete("/:id", deleteFeedback);

module.exports = router;
