const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// สร้างฟังก์ชัน query
const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = { query };  // ส่งออกฟังก์ชัน query