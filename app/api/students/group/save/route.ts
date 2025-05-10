// app/api/students/group/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  pool  from '@/lib/db';

export async function POST(req: NextRequest) {
  const { std_codes, group_name } = await req.json(); // std_codes: string[] หรือ string เดียว

  if (!group_name || !std_codes) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const codes = Array.isArray(std_codes) ? std_codes : [std_codes];

  try {
    const promises = codes.map(code =>
      pool.query('UPDATE tb_student SET group_name = $1 WHERE std_code = $2', [group_name, code])
    );
    await Promise.all(promises);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
