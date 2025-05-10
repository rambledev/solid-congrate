// app/api/students/options/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  pool  from '@/lib/db';

export async function GET() {
  try {
    const facTypes = await pool.query(`SELECT DISTINCT fac_type FROM tb_student`);
    const faculties = await pool.query(`SELECT DISTINCT faculty FROM tb_student`);
    const programs = await pool.query(`SELECT DISTINCT program FROM tb_student`);

    return NextResponse.json({
      facTypes: facTypes.rows.map(r => r.fac_type),
      faculties: faculties.rows.map(r => r.faculty),
      programs: programs.rows.map(r => r.program),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}
