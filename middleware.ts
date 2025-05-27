import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isCIOPath = path.startsWith("/cio") && !path.startsWith("/cio/login");
  const session = request.cookies.get("cio-session")?.value;

  // ตรวจสอบการเข้าถึงหน้า CIO
  if (isCIOPath) {
    if (!session) {
      return NextResponse.redirect(new URL("/cio/login", request.url));
    }

    try {
      const user = JSON.parse(session);
      if (user.role !== "cio") {
        return NextResponse.redirect(new URL("/cio/login", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/cio/login", request.url));
    }
  }

  // ถ้าเข้าหน้า login แต่ login อยู่แล้ว ให้ redirect ไป dashboard
  if (path.startsWith("/cio/login") && session) {
    try {
      const user = JSON.parse(session);
      if (user.role === "cio") {
        return NextResponse.redirect(new URL("/cio/dashboard", request.url));
      }
    } catch (error) {
      // ไม่ต้องทำอะไร ถ้า session ไม่ถูกต้อง
    }
  }

  return NextResponse.next();
}

// กำหนดให้ middleware ทำงานกับ paths เหล่านี้
export const config = {
  matcher: [
    "/cio/:path*",
    "/api/cio/:path*",
  ],
};