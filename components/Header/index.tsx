"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ใช้ useRouter สำหรับ redirect
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const pathUrl = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // ตรวจสอบสถานะการล็อกอิน
    const user = sessionStorage.getItem('user');
    setIsLoggedIn(user !== null);

    // ถ้ายังไม่ได้ล็อกอิน ให้ไปยังหน้า "/"
    if (!user) {
      router.push("/");
    }

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push("/"); // ไปยังหน้า "/" เมื่อออกจากระบบ
  };

  return (
    <header className={`fixed left-0 top-0 z-99999 w-full py-7 ${stickyMenu ? "bg-white !py-4 shadow transition duration-100 dark:bg-black" : ""}`}>
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <button aria-label="hamburger Toggler" className="block xl:hidden" onClick={() => setNavigationOpen(!navigationOpen)}>
            {/* Hamburger Toggle Button */}
          </button>
        </div>

        {/* Nav Menu Start */}
        {isLoggedIn && (
          <div className={`invisible h-0 w-full items-center justify-center xl:visible xl:flex xl:h-auto xl:w-full ${navigationOpen ? "navbar !visible mt-4 h-auto" : ""}`}>
            <nav>
              <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
                {menuData.map((menuItem, key) => (
                  <li key={key} className={menuItem.submenu && "group relative"}>
                    {menuItem.submenu ? (
                      <>
                        <button onClick={() => setDropdownToggler(!dropdownToggler)} className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary">
                          {menuItem.title}
                        </button>
                        <ul className={`dropdown ${dropdownToggler ? "flex" : ""}`}>
                          {menuItem.submenu.map((item, key) => (
                            <li key={key} className="hover:text-primary">
                              <Link href={item.path || "#"}>{item.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link href={`${menuItem.path}`} className={pathUrl === menuItem.path ? "text-primary hover:text-primary" : "hover:text-primary"}>
                        {menuItem.title}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <Link href="/profile" className="hover:text-primary">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="hover:text-primary">Logout</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;