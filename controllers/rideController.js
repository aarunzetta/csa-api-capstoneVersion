require("dotenv").config();
const db = require("../config/database");

// GET all rides with driver and passenger info
const getAllRides = async (req, res) => {
  try {
    const [rides] = await db.query(
      `SELECT 
        r.ride_id,
        r.pickup_latitude,
        r.pickup_longitude,
        r.pickup_address,
        r.dropoff_latitude,
        r.dropoff_longitude,
        r.dropoff_address,
        r.ride_distance_km,
        r.ride_duration_minutes,
        r.started_at,
        r.completed_at,
        d.driver_id,
        d.first_name AS driver_first_name,
        d.last_name AS driver_last_name,
        d.license_number,
        d.vehicle_plate_number,
        p.passenger_id,
        p.first_name AS passenger_first_name,
        p.last_name AS passenger_last_name,
        p.phone_number AS passenger_phone
      FROM rides r
      INNER JOIN drivers d ON r.driver_id = d.driver_id
      INNER JOIN passengers p ON r.passenger_id = p.passenger_id
      ORDER BY r.started_at DESC`,
    );

    res.json({
      success: true,
      count: rides.length,
      data: rides,
    });
  } catch (error) {
    console.error("Get all rides error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching rides.",
    });
  }
};

// GET single ride by ID with full details
const getRideById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rides] = await db.query(
      `SELECT 
        r.ride_id,
        r.pickup_latitude,
        r.pickup_longitude,
        r.pickup_address,
        r.dropoff_latitude,
        r.dropoff_longitude,
        r.dropoff_address,
        r.ride_distance_km,
        r.ride_duration_minutes,
        r.started_at,
        r.completed_at,
        d.driver_id,
        d.first_name AS driver_first_name,
        d.last_name AS driver_last_name,
        d.middle_name AS driver_middle_name,
        d.phone_number AS driver_phone,
        d.license_number,
        d.vehicle_plate_number,
        d.vehicle_ownership,
        p.passenger_id,
        p.first_name AS passenger_first_name,
        p.last_name AS passenger_last_name,
        p.middle_name AS passenger_middle_name,
        p.phone_number AS passenger_phone,
        p.email AS passenger_email
      FROM rides r
      INNER JOIN drivers d ON r.driver_id = d.driver_id
      INNER JOIN passengers p ON r.passenger_id = p.passenger_id
      WHERE r.ride_id = ?`,
      [id],
    );

    if (rides.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    res.json({
      success: true,
      data: rides[0],
    });
  } catch (error) {
    console.error("Get ride by ID error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching ride.",
    });
  }
};

// CREATE new ride (for testing purposes)
const createRide = async (req, res) => {
  try {
    const {
      driver_id,
      passenger_id,
      pickup_latitude,
      pickup_longitude,
      pickup_address,
      dropoff_latitude,
      dropoff_longitude,
      dropoff_address,
      ride_distance_km,
      ride_duration_minutes,
      started_at,
      completed_at,
    } = req.body;

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

    // Insert ride
    const [result] = await db.query(
      `INSERT INTO rides (driver_id, passenger_id, pickup_latitude, pickup_longitude, pickup_address,
                         dropoff_latitude, dropoff_longitude, dropoff_address, ride_distance_km,
                         ride_duration_minutes, started_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        driver_id,
        passenger_id,
        pickup_latitude || null,
        pickup_longitude || null,
        pickup_address || null,
        dropoff_latitude || null,
        dropoff_longitude || null,
        dropoff_address || null,
        ride_distance_km || null,
        ride_duration_minutes || null,
        started_at || null,
        completed_at || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Ride created successfully.",
      data: {
        ride_id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Create ride error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating ride.",
    });
  }
};

// DELETE ride (for admin purposes)
const deleteRide = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ride exists
    const [existing] = await db.query(
      "SELECT ride_id FROM rides WHERE ride_id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Delete ride
    await db.query("DELETE FROM rides WHERE ride_id = ?", [id]);

    res.json({
      success: true,
      message: "Ride deleted successfully.",
    });
  } catch (error) {
    console.error("Delete ride error:", error);

    // Check if error is due to foreign key constraint
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete ride. It has associated feedback.",
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while deleting ride.",
    });
  }
};

module.exports = {
  getAllRides,
  getRideById,
  createRide,
  deleteRide,
};
