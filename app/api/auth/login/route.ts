// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "5432"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM tb_member WHERE std_code = $1 AND password = $2';
    const values = [username, password];
    const result = await client.query(query, values);

    client.release();

    if (result.rows.length > 0) {
      return NextResponse.json({ success: true, user: result.rows[0] });
    } else {
      return NextResponse.json({ success: false, message: 'ข้อมูลไม่ถูกต้อง' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}