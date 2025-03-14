const pool = require('./db'); // นำเข้าจาก db.js

async function testDbConnection() {
  try {
    // เชื่อมต่อกับฐานข้อมูล
    const client = await pool.connect();

    // ทดสอบการ query ข้อมูลจากตาราง
    const result = await client.query('SELECT NOW()');

    // ปล่อยการเชื่อมต่อ
    client.release();

    // แสดงผลลัพธ์
    console.log('Connection successful:', result.rows[0]);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// เรียกใช้ฟังก์ชันทดสอบการเชื่อมต่อ
testDbConnection();