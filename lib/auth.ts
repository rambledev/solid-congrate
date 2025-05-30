import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkAdminSession() {
  const cookie = cookies();
  const token = cookie.get('congrate_token');
  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`, {
    headers: { Authorization: `Bearer ${token.value}` },
    cache: 'no-store',
  });
  const data = await res.json();

  if (data.role !== 'admin') return null;
  return data;
}
