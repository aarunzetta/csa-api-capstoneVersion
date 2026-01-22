require("dotenv").config();
const db = require("../config/database");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get counts from all tables
    const [passengersCount] = await db.query(
      "SELECT COUNT(*) as count FROM passengers",
    );
    const [driversCount] = await db.query(
      "SELECT COUNT(*) as count FROM drivers",
    );
    const [ridesCount] = await db.query("SELECT COUNT(*) as count FROM rides");
    const [adminsCount] = await db.query(
      "SELECT COUNT(*) as count FROM admins",
    );

    // You can also add more statistics like recent rides, active drivers, etc.
    const [recentRides] = await db.query(
      `SELECT COUNT(*) as count FROM rides 
       WHERE DATE(started_at) = CURDATE()`,
    );

    const [activeDrivers] = await db.query(
      `SELECT COUNT(*) as count FROM drivers 
       WHERE license_status = 'active'`,
    );

    res.json({
      success: true,
      data: {
        totalPassengers: passengersCount[0].count,
        totalDrivers: driversCount[0].count,
        totalRides: ridesCount[0].count,
        totalAdmins: adminsCount[0].count,
        // Additional stats
        todayRides: recentRides[0].count,
        activeDrivers: activeDrivers[0].count,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching dashboard statistics.",
    });
  }
};

module.exports = { getDashboardStats };
