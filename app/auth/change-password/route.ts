import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, newPassword } = await request.json();

    // อัปเดตรหัสผ่านและตั้งค่า firstpass เป็น false
    const query = `
      UPDATE tb_member 
      SET password = $1, firstpass = false 
      WHERE id = $2
      RETURNING id, name, role
    `;
    const { rows } = await pool.query(query, [newPassword, userId]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = rows[0];

    // สร้าง session หรือ token ตามที่คุณต้องการ
    return NextResponse.json(
      { 
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        },
        message: 'Password changed successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}