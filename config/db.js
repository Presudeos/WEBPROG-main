// File: config/db.js
const mysql = require('mysql2');
require('dotenv').config(); // Make sure dotenv is configured if running locally

const pool = mysql.createPool({
  host: process.env.DB_HOST, // Use Vercel env var directly
  user: process.env.DB_USERNAME, // Use DB_USERNAME from Vercel/TiDB
  password: process.env.DB_PASSWORD, // Use Vercel env var
  database: process.env.DB_DATABASE, // Use Vercel env var
  port: process.env.DB_PORT || 4000, // Explicitly set port 4000 for TiDB Cloud
  ssl: {
    // REQUIRED for TiDB Cloud / PlanetScale / most cloud DBs
    rejectUnauthorized: true
  },
  connectionLimit: 10 // Optional: Good practice for pooling
});

module.exports = pool.promise();