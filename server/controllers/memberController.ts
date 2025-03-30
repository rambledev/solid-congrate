import { query } from '../../lib/db'; // นำเข้าฟังก์ชัน query
import bcrypt from 'bcrypt';

// ฟังก์ชันสำหรับการสร้างสมาชิกใหม่
export const createMember = async ({
  studentId,
  fullName,
  faculty,
  major,
  phone,
  password,
  graduation,
  rentGown,
  gownSize,
  pin,
  photo,
}) => {
  try {
    // ตรวจสอบว่ามีการส่ง password มาหรือไม่ และเป็นสตริงหรือไม่
    if (typeof password !== 'string' || password.length === 0) {
      throw new Error("Password is required and must be a non-empty string");
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สั่งให้ insert ข้อมูลลง tb_member
    const result = await query(
      "INSERT INTO tb_member (std_code, name, faculty, program, phone, password, graduation, rentGown, gownSize, pin, photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [studentId, fullName, faculty, major, phone, hashedPassword, graduation, rentGown, gownSize, pin, photo]
    );

    return {
      message: "บันทึกข้อมูลสำเร็จ",
      data: result.rows[0], // ข้อมูลที่บันทึกเข้าไป
    };
  } catch (error) {
    throw new Error(error.message);
  }
};