'use client'

import { useState } from 'react'
import Sidebar from '@/components/Cio/Sidebar'
import { HiMenu } from 'react-icons/hi'

export default function CioLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <html lang="th">
      <body className="relative flex min-h-screen bg-white text-gray-800">
        {/* Mobile Toggle Button */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b">
          <h1 className="text-xl font-semibold">CIO-Graduate</h1>
          <button onClick={() => setIsSidebarOpen(prev => !prev)}>
            <HiMenu className="text-2xl" />
          </button>
        </div>

        {/* Sidebar Drawer (Mobile) */}
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className={`absolute left-0 top-0 h-full w-64 bg-[#0F172A] shadow-lg transform transition-transform duration-300 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()} // คลิกภายในไม่ปิด
          >
            <Sidebar />
          </div>
        </div>

        {/* Sidebar (Desktop only) */}
        <div className="hidden lg:block lg:w-64 bg-[#0F172A]">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen pt-14 lg:pt-0 z-0">
          <main className="p-4 bg-white">{children}</main>
        </div>
      </body>
    </html>
  )
}
