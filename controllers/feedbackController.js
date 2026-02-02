require("dotenv").config();
const db = require("../config/database");

// GET all feedbacks with ride, driver, and passenger info
const getAllFeedbacks = async (req, res) => {
  try {
    const [feedbacks] = await db.query(
      `SELECT 
        f.feedback_id,
        f.rating,
        f.comment,
        f.created_at,
        f.ride_id,
        r.pickup_address,
        r.dropoff_address,
        r.started_at AS ride_started_at,
        r.completed_at AS ride_completed_at,
        d.driver_id,
        d.first_name AS driver_first_name,
        d.last_name AS driver_last_name,
        d.license_number,
        p.passenger_id,
        p.first_name AS passenger_first_name,
        p.last_name AS passenger_last_name,
        p.email AS passenger_email
      FROM ride_feedback f
      INNER JOIN rides r ON f.ride_id = r.ride_id
      INNER JOIN drivers d ON f.driver_id = d.driver_id
      INNER JOIN passengers p ON f.passenger_id = p.passenger_id
      ORDER BY f.created_at DESC`,
    );

    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Get all feedbacks error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching feedbacks.",
    });
  }
};

// GET single feedback by ID with full details
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const [feedbacks] = await db.query(
      `SELECT 
        f.feedback_id,
        f.rating,
        f.comment,
        f.created_at,
        f.ride_id,
        r.pickup_latitude,
        r.pickup_longitude,
        r.pickup_address,
        r.dropoff_latitude,
        r.dropoff_longitude,
        r.dropoff_address,
        r.ride_distance_km,
        r.ride_duration_minutes,
        r.started_at AS ride_started_at,
        r.completed_at AS ride_completed_at,
        d.driver_id,
        d.first_name AS driver_first_name,
        d.last_name AS driver_last_name,
        d.middle_name AS driver_middle_name,
        d.phone_number AS driver_phone,
        d.license_number,
        d.vehicle_plate_number,
        p.passenger_id,
        p.first_name AS passenger_first_name,
        p.last_name AS passenger_last_name,
        p.middle_name AS passenger_middle_name,
        p.phone_number AS passenger_phone,
        p.email AS passenger_email
      FROM ride_feedback f
      INNER JOIN rides r ON f.ride_id = r.ride_id
      INNER JOIN drivers d ON f.driver_id = d.driver_id
      INNER JOIN passengers p ON f.passenger_id = p.passenger_id
      WHERE f.feedback_id = ?`,
      [id],
    );

    if (feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    res.json({
      success: true,
      data: feedbacks[0],
    });
  } catch (error) {
    console.error("Get feedback by ID error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching feedback.",
    });
  }
};

// CREATE new feedback (for testing purposes)
const createFeedback = async (req, res) => {
  try {
    const { ride_id, passenger_id, driver_id, rating, comment } = req.body;

    // Check if ride exists
    const [ride] = await db.query(
      "SELECT ride_id FROM rides WHERE ride_id = ?",
      [ride_id],
    );

    if (ride.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Check if passenger exists
    const [passenger] = await db.query(
      "SELECT passenger_id FROM passengers WHERE passenger_id = ?",
      [passenger_id],
    );

    if (passenger.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found.",
      });
    }

    // Check if driver exists
    const [driver] = await db.query(
      "SELECT driver_id FROM drivers WHERE driver_id = ?",
      [driver_id],
    );

    if (driver.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
      });
    }

    // Check if feedback already exists for this ride and passenger
    const [existingFeedback] = await db.query(
      "SELECT feedback_id FROM ride_feedback WHERE ride_id = ? AND passenger_id = ?",
      [ride_id, passenger_id],
    );

    if (existingFeedback.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Feedback already exists for this ride.",
      });
    }

    // Insert feedback
    const [result] = await db.query(
      `INSERT INTO ride_feedback (ride_id, passenger_id, driver_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [ride_id, passenger_id, driver_id, rating || null, comment || null],
    );

    res.status(201).json({
      success: true,
      message: "Feedback created successfully.",
      data: {
        feedback_id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating feedback.",
    });
  }
};

// DELETE feedback (for admin purposes)
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if feedback exists
    const [existing] = await db.query(
      "SELECT feedback_id FROM ride_feedback WHERE feedback_id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    // Delete feedback
    await db.query("DELETE FROM ride_feedback WHERE feedback_id = ?", [id]);

    res.json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting feedback.",
    });
  }
};

module.exports = {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  deleteFeedback,
};
