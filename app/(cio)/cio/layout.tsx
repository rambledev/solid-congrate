'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Cio/Sidebar'
import { HiMenu } from 'react-icons/hi'
import { usePathname, useRouter } from 'next/navigation'

export default function CioLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/cio/check-auth')
        const data = await response.json()
        
        if (data.authenticated && data.user?.role === 'cio') {
          setIsLoggedIn(true)
          if (pathname === '/cio/login') {
            router.push('/cio/dashboard')
          }
        } else {
          setIsLoggedIn(false)
          if (!pathname.startsWith('/cio/login')) {
            router.push('/cio/login')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsLoggedIn(false)
        if (!pathname.startsWith('/cio/login')) {
          router.push('/cio/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const isLoginPage = pathname === '/cio/login'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <html lang="th">
      <body className="relative flex min-h-screen bg-white text-gray-800">
        {/* ส่วนที่เหลือเหมือนเดิม */}
        {/* ... */}
      </body>
    </html>
  )
}