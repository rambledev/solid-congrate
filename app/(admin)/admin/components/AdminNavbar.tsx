'use client'

import { Dispatch, SetStateAction } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'

type NavbarProps = {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export default function AdminNavbar({ setSidebarOpen }: NavbarProps) {
  return (
    <div className="bg-green-500 shadow-sm p-4 flex items-center justify-between">
      {/* Hamburger Button */}
      <button
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6 text-gray-600" />
      </button>
      <div className="text-lg font-bold text-gray-700">Admin Role</div>
      <div className="flex items-center space-x-4">
        {/* Profile or Notification Icons (สามารถเพิ่มได้ภายหลัง) */}
      </div>
    </div>
  )
}
