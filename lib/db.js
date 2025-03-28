const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Initializing database connection...');

// สร้างฟังก์ชัน query และจัดการข้อผิดพลาด
const query = async (text, params) => {
  console.log(`Executing query: ${text} with params: ${JSON.stringify(params)}`);
  try {
    const result = await pool.query(text, params);
    console.log(`Query successful: ${text}`);
    return result;
  } catch (err) {
    console.error('Query error', err.stack);
    throw err; // หรือจัดการกับ error ตามที่เหมาะสม
  }
};

// ทดสอบการเชื่อมต่อกับฐานข้อมูล
pool.connect()
  .then(client => {
    console.log('Database connection established. Testing query...');
    return client.query('SELECT NOW()')
      .then(res => {
        console.log('Connected to db. Current time:', res.rows[0]);
        client.release();
      })
      .catch(err => {
        console.error('Error executing test query', err.stack);
        client.release();
      });
  })
  .catch(err => console.error('Database connection error', err.stack));

// ส่งออกฟังก์ชัน query
module.exports = { query };
