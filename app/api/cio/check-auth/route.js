import { NextResponse } from "next/server";

export async function GET(request) {
  const session = request.cookies.get("cio-session")?.value;

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const user = JSON.parse(session);
    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}