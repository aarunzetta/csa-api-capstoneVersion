require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../config/database");

// GET all passengers
const getAllPassengers = async (req, res) => {
  try {
    const [passengers] = await db.query(
      "SELECT passenger_id, first_name, last_name, middle_name, date_of_birth, username, phone_number, email, registered_at FROM passengers ORDER BY registered_at DESC",
    );

    res.json({
      success: true,
      count: passengers.length,
      data: passengers,
    });
  } catch (error) {
    console.error("Get all passengers error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching passengers.",
    });
  }
};

// GET single passenger by ID
const getPassengerById = async (req, res) => {
  try {
    const { id } = req.params;

    const [passengers] = await db.query(
      "SELECT passenger_id, first_name, last_name, middle_name, date_of_birth, username, phone_number, email, registered_at FROM passengers WHERE passenger_id = ?",
      [id],
    );

    if (passengers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found.",
      });
    }

    res.json({
      success: true,
      data: passengers[0],
    });
  } catch (error) {
    console.error("Get passenger by ID error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching passenger.",
    });
  }
};

// CREATE new passenger
const createPassenger = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      middle_name,
      date_of_birth,
      username,
      phone_number,
      email,
      password,
    } = req.body;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !date_of_birth ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: first_name, last_name, date_of_birth, username, email, password",
      });
    }

    // Check if username already exists
    const [existingUsername] = await db.query(
      "SELECT passenger_id FROM passengers WHERE username = ?",
      [username],
    );

    if (existingUsername.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already exists.",
      });
    }

    // Check if email already exists
    const [existingEmail] = await db.query(
      "SELECT passenger_id FROM passengers WHERE email = ?",
      [email],
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert passenger
    const [result] = await db.query(
      `INSERT INTO passengers (first_name, last_name, middle_name, date_of_birth, username, phone_number, email, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        middle_name || null,
        date_of_birth,
        username,
        phone_number || null,
        email,
        hashedPassword,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Passenger created successfully.",
      data: {
        passenger_id: result.insertId,
        first_name,
        last_name,
        middle_name,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Create passenger error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating passenger.",
    });
  }
};

// UPDATE passenger
const updatePassenger = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      middle_name,
      date_of_birth,
      username,
      phone_number,
      email,
      password,
    } = req.body;

    // Check if passenger exists
    const [existing] = await db.query(
      "SELECT passenger_id FROM passengers WHERE passenger_id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found.",
      });
    }

    // Check if new username is taken by another passenger
    if (username) {
      const [existingUsername] = await db.query(
        "SELECT passenger_id FROM passengers WHERE username = ? AND passenger_id != ?",
        [username, id],
      );

      if (existingUsername.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username already exists.",
        });
      }
    }

    // Check if new email is taken by another passenger
    if (email) {
      const [existingEmail] = await db.query(
        "SELECT passenger_id FROM passengers WHERE email = ? AND passenger_id != ?",
        [email, id],
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    // Build update query dynamically
    let updateFields = [];
    let updateValues = [];

    if (first_name) {
      updateFields.push("first_name = ?");
      updateValues.push(first_name);
    }
    if (last_name) {
      updateFields.push("last_name = ?");
      updateValues.push(last_name);
    }
    if (middle_name !== undefined) {
      updateFields.push("middle_name = ?");
      updateValues.push(middle_name || null);
    }
    if (date_of_birth) {
      updateFields.push("date_of_birth = ?");
      updateValues.push(date_of_birth);
    }
    if (username) {
      updateFields.push("username = ?");
      updateValues.push(username);
    }
    if (phone_number !== undefined) {
      updateFields.push("phone_number = ?");
      updateValues.push(phone_number || null);
    }
    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password_hash = ?");
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update.",
      });
    }

    updateValues.push(id);

    await db.query(
      `UPDATE passengers SET ${updateFields.join(", ")} WHERE passenger_id = ?`,
      updateValues,
    );

    res.json({
      success: true,
      message: "Passenger updated successfully.",
    });
  } catch (error) {
    console.error("Update passenger error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating passenger.",
    });
  }
};

// DELETE passenger
const deletePassenger = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if passenger exists
    const [existing] = await db.query(
      "SELECT passenger_id FROM passengers WHERE passenger_id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found.",
      });
    }

    // Delete passenger
    await db.query("DELETE FROM passengers WHERE passenger_id = ?", [id]);

    res.json({
      success: true,
      message: "Passenger deleted successfully.",
    });
  } catch (error) {
    console.error("Delete passenger error:", error);

    // Check if error is due to foreign key constraint
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete passenger. They have associated rides or feedback.",
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while deleting passenger.",
    });
  }
};

module.exports = {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
};
