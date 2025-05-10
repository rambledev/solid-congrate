'use client'

import { ReactNode, useState } from 'react'
import Sidebar from './components/Sidebar'
import AdminNavbar from './components/AdminNavbar'
import AdminFooter from './components/AdminFooter'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className="flex-1 p-4 bg-gray-100">
          {children}
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  )
}
