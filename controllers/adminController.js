require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../config/database");

// GET all admins
const getAllAdmins = async (req, res) => {
  try {
    const [admins] = await db.query(
      `SELECT admin_id, username, first_name, last_name, email, phone_number, 
              role, is_active, registered_at, last_login_at 
       FROM admins ORDER BY registered_at DESC`,
    );

    res.json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching admins.",
    });
  }
};

// GET single admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const [admins] = await db.query(
      `SELECT admin_id, username, first_name, last_name, email, phone_number,
              role, is_active, registered_at, last_login_at
       FROM admins WHERE admin_id = ?`,
      [id],
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    res.json({
      success: true,
      data: admins[0],
    });
  } catch (error) {
    console.error("Get admin by ID error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching admin.",
    });
  }
};

// CREATE new admin
const createAdmin = async (req, res) => {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      phone_number,
      password,
      role,
      is_active,
    } = req.body;

    // Check if username already exists
    const [existingUsername] = await db.query(
      "SELECT admin_id FROM admins WHERE username = ?",
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
      "SELECT admin_id FROM admins WHERE email = ?",
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

    // Insert admin
    const [result] = await db.query(
      `INSERT INTO admins (username, first_name, last_name, email, phone_number, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        first_name,
        last_name,
        email,
        phone_number || null,
        hashedPassword,
        role || "admin",
        is_active !== undefined ? is_active : 1,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      data: {
        admin_id: result.insertId,
        username,
        first_name,
        last_name,
        email,
        role: role || "admin",
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating admin.",
    });
  }
};

// UPDATE admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      first_name,
      last_name,
      email,
      phone_number,
      password,
      role,
      is_active,
    } = req.body;

    // Check if admin exists
    const [existing] = await db.query(
      "SELECT admin_id FROM admins WHERE admin_id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Check if new username is taken by another admin
    if (username) {
      const [existingUsername] = await db.query(
        "SELECT admin_id FROM admins WHERE username = ? AND admin_id != ?",
        [username, id],
      );

      if (existingUsername.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username already exists.",
        });
      }
    }

    // Check if new email is taken by another admin
    if (email) {
      const [existingEmail] = await db.query(
        "SELECT admin_id FROM admins WHERE email = ? AND admin_id != ?",
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

    if (username) {
      updateFields.push("username = ?");
      updateValues.push(username);
    }
    if (first_name) {
      updateFields.push("first_name = ?");
      updateValues.push(first_name);
    }
    if (last_name) {
      updateFields.push("last_name = ?");
      updateValues.push(last_name);
    }
    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (phone_number !== undefined) {
      updateFields.push("phone_number = ?");
      updateValues.push(phone_number || null);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password_hash = ?");
      updateValues.push(hashedPassword);
    }
    if (role) {
      updateFields.push("role = ?");
      updateValues.push(role);
    }
    if (is_active !== undefined) {
      updateFields.push("is_active = ?");
      updateValues.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update.",
      });
    }

    updateValues.push(id);

    await db.query(
      `UPDATE admins SET ${updateFields.join(", ")} WHERE admin_id = ?`,
      updateValues,
    );

    res.json({
      success: true,
      message: "Admin updated successfully.",
    });
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating admin.",
    });
  }
};

// DELETE admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const [existing] = await db.query(
      "SELECT admin_id FROM admins WHERE admin_id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Prevent deleting yourself (optional security measure)
    if (req.user && req.user.admin_id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // Delete admin
    await db.query("DELETE FROM admins WHERE admin_id = ?", [id]);

    res.json({
      success: true,
      message: "Admin deleted successfully.",
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting admin.",
    });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
