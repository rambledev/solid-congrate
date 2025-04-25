// app/api/student/search/route.ts
import { NextResponse } from 'next/server';
import pool from "@/lib/db"; // ✅ import มาใช้ตรง ๆ


export async function POST(req: Request) {
  try {
    const { std_code, name_th, grad_year } = await req.json();
    const client = await pool.connect();

    // สร้าง query แบบ dynamic
    let baseQuery = 'SELECT id, std_code, name_th, faculty, program FROM tb_student WHERE 1=1';
    const values: any[] = [];
    let paramIndex = 1;

    if (std_code) {
      baseQuery += ` AND std_code ILIKE $${paramIndex++}`;
      values.push(`%${std_code}%`);
    }

    if (name_th) {
      baseQuery += ` AND name_th ILIKE $${paramIndex++}`;
      values.push(`%${name_th}%`);
    }

    if (grad_year) {
      baseQuery += ` AND start_year ILIKE $${paramIndex++}`;
      values.push(`%${grad_year}%`);
    }

    baseQuery += ' ORDER BY std_code LIMIT 100';

    const result = await client.query(baseQuery, values);
    client.release();

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
