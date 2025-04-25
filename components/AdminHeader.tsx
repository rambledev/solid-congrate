'use client'

import { Menu } from 'lucide-react'

export default function AdminHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="w-full bg-green-900 p-4 flex items-center justify-between shadow-md">
      {/* ปุ่ม Hamburger สำหรับ mobile */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden bg-white/90 rounded-full p-2 shadow"
        aria-label="Toggle Menu"
      >
        <Menu className="text-green-900 w-6 h-6" />
      </button>

      {/* ข้อความส่วนหัว */}
      <h1 className="text-white text-xl font-bold mx-auto md:mx-0">
        Admin ระบบลงทะเบียนรับปริญญา
      </h1>

      {/* ช่องว่างสำหรับจัดตำแหน่ง (เพื่อ balance กับ hamburger) */}
      <div className="w-8 h-8 hidden md:block" />
    </header>
  )
}
