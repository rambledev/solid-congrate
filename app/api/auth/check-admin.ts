import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db'; // db connection

export async function GET() {
  const token = cookies().get('congrate_token')?.value;
  if (!token) return NextResponse.json({ ok: false });

  const member = await db.query(`SELECT * FROM tb_member WHERE firstpass = $1`, [token]);
  if (member.rows.length === 0 || member.rows[0].role !== 'admin') {
    return NextResponse.json({ ok: false });
  }

  return NextResponse.json({ ok: true });
}
