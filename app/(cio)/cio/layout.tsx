'use client'

import { ReactNode, useState } from 'react'
import Sidebar from './components/Sidebar'
import AdminNavbar from './components/CioNavbar'
import AdminFooter from './components/CioFooter'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-white"> {/* เปลี่ยนพื้นหลังเป็นขาว */}
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 bg-white">
        {/* Navbar */}
        <div className="bg-red-600">
          <AdminNavbar setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 bg-white text-gray-800">
          {children}
        </main>

        {/* Footer */}
        <div className="bg-red-600 text-white">
          <AdminFooter />
        </div>
      </div>
    </div>
  )
}
