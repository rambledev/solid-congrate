"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import menuData from "./menuData"; // เมนูที่เตรียมไว้ล่วงหน้า

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const pathUrl = usePathname();

  const handleStickyMenu = () => {
    setStickyMenu(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full py-7 ${
        stickyMenu ? "bg-white !py-4 shadow transition duration-100 dark:bg-black" : ""
      }`}
    >
      <div className="relative mx-auto max-w-screen-xl flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center justify-between w-full">
          <button
            aria-label="hamburger Toggler"
            className="block xl:hidden"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="hamburger-icon text-xl">
              {navigationOpen ? "✖" : "☰"}
            </span>
          </button>
        </div>

        <div
          className={`invisible h-0 w-full items-center justify-center xl:visible xl:flex xl:h-auto xl:w-full ${
            navigationOpen ? "navbar !visible mt-4 h-auto" : ""
          }`}
        >
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
            {menuData["public"]?.map((menuItem) =>
  menuItem.path ? (
    <li key={menuItem.id}>
      <Link href={menuItem.path} className="hover:text-primary">
        {menuItem.title}
      </Link>
    </li>
  ) : null
)}

            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
