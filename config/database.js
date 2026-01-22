const mysql = require("mysql2");
require("dotenv").config();

// Create a connection pool
// A pool manages multiple connections and reuses them efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Maximum 10 connections at once
  queueLimit: 0,
});

// Get promise-based pool for async/await usage
const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Database connected successfully!");
  connection.release(); // Release connection back to pool
});

module.exports = promisePool;
