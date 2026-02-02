require("dotenv").config();
const db = require("../config/database");

// GET all drivers
const getAllDrivers = async (req, res) => {
  try {
    const [drivers] = await db.query(
      `SELECT driver_id, first_name, last_name, middle_name, date_of_birth, 
              address_region, address_province, address_city, address_barangay, address_street,
              phone_number, license_number, license_expiration_date, license_status,
              vehicle_ownership, vehicle_plate_number, qr_code, registered_at 
       FROM drivers ORDER BY registered_at DESC`,
    );

    res.json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    console.error("Get all drivers error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching drivers.",
    });
  }
};

// GET single driver by ID
const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    const [drivers] = await db.query(
      `SELECT driver_id, first_name, last_name, middle_name, date_of_birth,
              address_region, address_province, address_city, address_barangay, address_street,
              phone_number, license_number, license_expiration_date, license_status,
              vehicle_ownership, vehicle_plate_number, qr_code, registered_at
       FROM drivers WHERE driver_id = ?`,
      [id],
    );

    if (drivers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
      });
    }

    res.json({
      success: true,
      data: drivers[0],
    });
  } catch (error) {
    console.error("Get driver by ID error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching driver.",
    });
  }
};

// CREATE new driver
const createDriver = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      middle_name,
      date_of_birth,
      address_region,
      address_province,
      address_city,
      address_barangay,
      address_street,
      phone_number,
      license_number,
      license_expiration_date,
      license_status,
      vehicle_ownership,
      vehicle_plate_number,
      qr_code,
    } = req.body;

    // Check if license number already exists
    const [existingLicense] = await db.query(
      "SELECT driver_id FROM drivers WHERE license_number = ?",
      [license_number],
    );

    if (existingLicense.length > 0) {
      return res.status(400).json({
        success: false,
        message: "License number already exists.",
      });
    }

    // Check if QR code already exists (if provided)
    if (qr_code) {
      const [existingQR] = await db.query(
        "SELECT driver_id FROM drivers WHERE qr_code = ?",
        [qr_code],
      );

      if (existingQR.length > 0) {
        return res.status(400).json({
          success: false,
          message: "QR code already exists.",
        });
      }
    }

    // Insert driver
    const [result] = await db.query(
      `INSERT INTO drivers (first_name, last_name, middle_name, date_of_birth,
                           address_region, address_province, address_city, address_barangay, address_street,
                           phone_number, license_number, license_expiration_date, license_status,
                           vehicle_ownership, vehicle_plate_number, qr_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        middle_name || null,
        date_of_birth,
        address_region || null,
        address_province || null,
        address_city || null,
        address_barangay || null,
        address_street || null,
        phone_number || null,
        license_number,
        license_expiration_date,
        license_status || "active",
        vehicle_ownership || null,
        vehicle_plate_number || null,
        qr_code || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Driver created successfully.",
      data: {
        driver_id: result.insertId,
        first_name,
        last_name,
        license_number,
      },
    });
  } catch (error) {
    console.error("Create driver error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating driver.",
    });
  }
};

// UPDATE driver
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      middle_name,
      date_of_birth,
      address_region,
      address_province,
      address_city,
      address_barangay,
      address_street,
      phone_number,
      license_number,
      license_expiration_date,
      license_status,
      vehicle_ownership,
      vehicle_plate_number,
      qr_code,
    } = req.body;

    // Check if driver exists
    const [existing] = await db.query(
      "SELECT driver_id FROM drivers WHERE driver_id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
      });
    }

    // Check if new license number is taken by another driver
    if (license_number) {
      const [existingLicense] = await db.query(
        "SELECT driver_id FROM drivers WHERE license_number = ? AND driver_id != ?",
        [license_number, id],
      );

      if (existingLicense.length > 0) {
        return res.status(400).json({
          success: false,
          message: "License number already exists.",
        });
      }
    }

    // Check if new QR code is taken by another driver
    if (qr_code) {
      const [existingQR] = await db.query(
        "SELECT driver_id FROM drivers WHERE qr_code = ? AND driver_id != ?",
        [qr_code, id],
      );

      if (existingQR.length > 0) {
        return res.status(400).json({
          success: false,
          message: "QR code already exists.",
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
    if (address_region !== undefined) {
      updateFields.push("address_region = ?");
      updateValues.push(address_region || null);
    }
    if (address_province !== undefined) {
      updateFields.push("address_province = ?");
      updateValues.push(address_province || null);
    }
    if (address_city !== undefined) {
      updateFields.push("address_city = ?");
      updateValues.push(address_city || null);
    }
    if (address_barangay !== undefined) {
      updateFields.push("address_barangay = ?");
      updateValues.push(address_barangay || null);
    }
    if (address_street !== undefined) {
      updateFields.push("address_street = ?");
      updateValues.push(address_street || null);
    }
    if (phone_number !== undefined) {
      updateFields.push("phone_number = ?");
      updateValues.push(phone_number || null);
    }
    if (license_number) {
      updateFields.push("license_number = ?");
      updateValues.push(license_number);
    }
    if (license_expiration_date) {
      updateFields.push("license_expiration_date = ?");
      updateValues.push(license_expiration_date);
    }
    if (license_status) {
      updateFields.push("license_status = ?");
      updateValues.push(license_status);
    }
    if (vehicle_ownership !== undefined) {
      updateFields.push("vehicle_ownership = ?");
      updateValues.push(vehicle_ownership || null);
    }
    if (vehicle_plate_number !== undefined) {
      updateFields.push("vehicle_plate_number = ?");
      updateValues.push(vehicle_plate_number || null);
    }
    if (qr_code !== undefined) {
      updateFields.push("qr_code = ?");
      updateValues.push(qr_code || null);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update.",
      });
    }

    updateValues.push(id);

    await db.query(
      `UPDATE drivers SET ${updateFields.join(", ")} WHERE driver_id = ?`,
      updateValues,
    );

    res.json({
      success: true,
      message: "Driver updated successfully.",
    });
  } catch (error) {
    console.error("Update driver error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating driver.",
    });
  }
};

// DELETE driver
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if driver exists
    const [existing] = await db.query(
      "SELECT driver_id FROM drivers WHERE driver_id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
      });
    }

    // Delete driver
    await db.query("DELETE FROM drivers WHERE driver_id = ?", [id]);

    res.json({
      success: true,
      message: "Driver deleted successfully.",
    });
  } catch (error) {
    console.error("Delete driver error:", error);

    // Check if error is due to foreign key constraint
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete driver. They have associated rides or feedback.",
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while deleting driver.",
    });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
