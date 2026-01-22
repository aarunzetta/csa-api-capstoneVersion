const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
require("dotenv").config();

// Login controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Find admin by username
    const [admins] = await db.query(
      "SELECT * FROM admins WHERE username = ? AND is_active = 1",
      [username],
    );

    // Check if admin exists
    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const admin = admins[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Update last login time
    await db.query(
      "UPDATE admins SET last_login_at = CURRENT_TIMESTAMP WHERE admin_id = ?",
      [admin.admin_id],
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }, // Token expires in 24 hours
    );

    // Send response (exclude password_hash)
    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        admin_id: admin.admin_id,
        username: admin.username,
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
};

// Get current logged-in admin info
const getMe = async (req, res) => {
  try {
    // req.user comes from authMiddleware
    const [admins] = await db.query(
      "SELECT admin_id, username, first_name, last_name, email, phone_number, role, is_active, registered_at, last_login_at FROM admins WHERE admin_id = ?",
      [req.user.admin_id],
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    res.json({
      success: true,
      admin: admins[0],
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching admin info.",
    });
  }
};

module.exports = { login, getMe };
