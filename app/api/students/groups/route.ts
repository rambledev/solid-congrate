// app/api/students/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  pool  from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const facType = searchParams.get('fac_type');

  let query = 'SELECT * FROM tb_student WHERE 1=1';
  const params: any[] = [];

  if (name) {
    params.push(`%${name}%`);
    query += ` AND name_th ILIKE $${params.length}`;
  }
  if (facType) {
    params.push(facType);
    query += ` AND fac_type = $${params.length}`;
  }

  const students = await pool.query(query, params);
  const facTypes = await pool.query(`SELECT DISTINCT fac_type FROM tb_student`);

  return NextResponse.json({
    students: students.rows,
    facTypes: facTypes.rows.map(r => r.fac_type),
  });
}
