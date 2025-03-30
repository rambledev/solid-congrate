import { Elysia } from 'elysia';
import { login } from './controllers/authController'; // นำเข้า authController
import { createMember } from './controllers/memberController'; // นำเข้า memberController

const app = new Elysia();

// Route สำหรับการเข้าสู่ระบบ
app.post('/api/auth/login', async (req) => {
  const body = await req.json();
  const { username, password } = body;
  
  try {
    const result = await login(username, password);

    if (result.success) {
      return { success: true, user: result.user };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal server error', error: error.message };
  }
});

// Route สำหรับการสร้างสมาชิกใหม่
app.post('/api/member', async (req) => {
  const body = await req.json();
  
  try {
    const result = await createMember(body);
    return result;
  } catch (error) {
    console.error("Error inserting data:", error);
    return { message: "เกิดข้อผิดพลาด", error: error.message };
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});