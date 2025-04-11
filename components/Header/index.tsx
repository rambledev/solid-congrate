"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import menuData from "./menuData"; // นำเข้า menuData จากไฟล์ที่สร้างไว้

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>(""); // ตั้งค่าเป็น string แทน null
  const pathUrl = usePathname();
  const router = useRouter();

  // ฟังก์ชันสำหรับทำให้เมนูติดตั้งบนหน้า
  const handleStickyMenu = () => {
    setStickyMenu(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    
    // ตรวจสอบ sessionStorage เพื่อดึงข้อมูลผู้ใช้
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserRole(parsedUserData.role);
    } else if (pathUrl !== "/") {
      router.push("/");
    }

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, [router, pathUrl]);

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserRole(""); // รีเซ็ต userRole
    router.push("/");
  };

  return (
    <header className={`fixed left-0 top-0 z-99999 w-full py-7 ${stickyMenu ? "bg-white !py-4 shadow transition duration-100 dark:bg-black" : ""}`}>
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <button aria-label="hamburger Toggler" className="block xl:hidden" onClick={() => setNavigationOpen(!navigationOpen)}>
            {/* Button สำหรับเปิด/ปิดเมนู */}
            <span className="hamburger-icon">{navigationOpen ? "✖" : "☰"}</span>
          </button>
        </div>

        <div className={`invisible h-0 w-full items-center justify-center xl:visible xl:flex xl:h-auto xl:w-full ${navigationOpen ? "navbar !visible mt-4 h-auto" : ""}`}>
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
              {isLoggedIn ? (
                // ตรวจสอบว่า userRole มีค่าและเข้าถึงเมนูได้
                menuData[userRole as string]?.map((menuItem) => (
                  <li key={menuItem.id}>
                    <Link href={menuItem.path} className="hover:text-primary">
                      {menuItem.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/" className="hover:text-primary">Login</Link>
                  </li>
                  {/* <li>
                    <Link href="/register" className="hover:text-primary">Register</Link>
                  </li> */}
                </>
              )}
              {isLoggedIn && (
                <li>
                  <button onClick={handleLogout} className="hover:text-primary">Logout</button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;