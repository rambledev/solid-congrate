'use client'

import { usePathname } from 'next/navigation'
import { HomeIcon, UserIcon, ShoppingBagIcon } from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, href: '/cio/dashboard' },
]

const managementItems = [
  { name: 'User', icon: UserIcon, href: '/cio/user' },
  { name: 'Role', icon: ShoppingBagIcon, href: '/cio/role' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 lg:w-72 bg-gray-900 text-white p-4 lg:p-6 min-h-screen">
      {/* Logo */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-base lg:text-lg font-bold">CIO-Graduate</h2>
      </div>

      {/* Overview Section */}
      <div className="mb-4 lg:mb-6">
        <h3 className="text-xs uppercase text-gray-400 mb-2 lg:mb-3">OVERVIEW</h3>
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors ${
                pathname === item.href ? 'bg-red-600 text-white' : 'text-gray-300'
              }`}
            >
              <item.icon className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Management Section */}
      <div>
        <h3 className="text-xs uppercase text-gray-400 mb-2 lg:mb-3">MANAGEMENT</h3>
        <nav className="space-y-1">
          {managementItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors ${
                pathname === item.href ? 'bg-red-600 text-white' : 'text-gray-300'
              }`}
            >
              <item.icon className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
