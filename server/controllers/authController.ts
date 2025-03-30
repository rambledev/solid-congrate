import { query } from '../../lib/db'; // นำเข้าฟังก์ชัน query

// ฟังก์ชันสำหรับการเข้าสู่ระบบ
export const login = async (username: string, password: string) => {
  const queryString = 'SELECT * FROM tb_member WHERE std_code = $1 AND password = $2';
  const values = [username, password];

  const result = await query(queryString, values);

  if (result.rowCount > 0) {
    return { success: true, user: result.rows[0] };
  } else {
    return { success: false, message: 'ข้อมูลไม่ถูกต้อง' };
  }
};