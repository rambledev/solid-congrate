'use client'

import { useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import Sidebar from './Sidebar'

export default function CioHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b lg:static lg:pl-6">
        <h1 className="text-xl font-bold text-gray-800">CIO-Graduate</h1>
        <button
          className="lg:hidden text-2xl text-gray-800"
          onClick={() => setIsSidebarOpen(prev => !prev)}
          aria-label="Toggle sidebar"
        >
          <HiMenu />
        </button>
      </header>

      {/* Sidebar Drawer for Mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)} // Click outside to close
      >
        <div
          className={`absolute top-0 left-0 w-64 h-full bg-[#0F172A] transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <Sidebar />
        </div>
      </div>
    </>
  )
}
