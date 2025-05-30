'use client'

import { Dispatch, SetStateAction } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserIcon } from '@heroicons/react/24/outline'

import {
  HomeIcon,
  UserGroupIcon,
  IdentificationIcon,
  ClipboardDocumentIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

type SidebarProps = {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const mainMenu = [
  { title: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
  { title: 'Profile', path: '/admin/profile', icon: UserIcon },
  { title: 'รายชื่อบัณฑิต', path: '/admin/graduates', icon: UserGroupIcon },
  { title: 'บัตรบัณฑิต', path: '/admin/graduates-card', icon: IdentificationIcon },
  { title: 'ข้อมูลลงทะเบียน', path: '/admin/registration-info', icon: ClipboardDocumentIcon },
  { title: 'ข้อมูลการมีงานทำ', path: '/admin/employment-info', icon: BriefcaseIcon }
]

const reportMenu = [
  { title: 'รายชื่อลงทะเบียน', path: '/admin/reports/registration', icon: DocumentTextIcon },
  { title: 'ข้อมูลการมีงานทำ', path: '/admin/reports/employment', icon: DocumentTextIcon },
  { title: 'ข้อมูลการลงทะเบียน', path: '/admin/reports/registration-info', icon: DocumentTextIcon }
]

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <div className={`fixed inset-0 z-40 flex transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="relative flex flex-col w-64 bg-red-900 shadow-lg h-full text-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="bg-white rounded-full p-1">
  <XMarkIcon className="h-5 w-5 text-black" />
</div>

              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <nav className="space-y-2 px-4">
                {mainMenu.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500 ${
                      pathname === item.path ? 'bg-red-700 font-semibold' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>

              {/* Reports */}
              <div className="mt-8">
                <h4 className="px-3 text-xs font-bold text-red-200 uppercase tracking-wide">รายงาน</h4>
                <nav className="mt-3 space-y-2 px-4">
                  {reportMenu.map((item, index) => (
                    <Link
                      key={index}
                      href={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500 ${
                        pathname === item.path ? 'bg-red-700 font-semibold' : ''
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Logout */}
              <div className="mt-8 px-4">
                <Link
                  href="/admin/logout"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>ออกจากระบบ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-red-800 shadow-lg min-h-screen text-white">
          <div className="flex-1 flex flex-col pt-5">
            {/* Main menu */}
            <nav className="space-y-2 px-4">
              {mainMenu.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500 ${
                    pathname === item.path ? 'bg-red-700 font-semibold' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>

            {/* Reports */}
            <div className="mt-8">
              <h4 className="px-4 text-xs font-bold text-red-200 uppercase tracking-wide">รายงาน</h4>
              <nav className="mt-3 space-y-2 px-4">
                {reportMenu.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500 ${
                      pathname === item.path ? 'bg-red-700 font-semibold' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Logout */}
            <div className="mt-auto mb-6 px-4">
              <Link
                href="/admin/logout"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>ออกจากระบบ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
