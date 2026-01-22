const bcrypt = require("bcryptjs");
const db = require("./config/database");

async function createTestAdmin() {
  try {
    // Hash the password
    const password = "admintest"; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin into database
    const [result] = await db.query(
      `INSERT INTO admins (username, first_name, last_name, email, password_hash, role, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "admin",
        "Admin",
        "User",
        "admin@example.com",
        hashedPassword,
        "super_admin",
        1,
      ],
    );

    console.log("✅ Test admin created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Admin ID:", result.insertId);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createTestAdmin();
