'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@mui/material'

export default function MaterioLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const userRaw = sessionStorage.getItem('user')
    if (!userRaw) return router.push('/auth/admin-login')

    const user = JSON.parse(userRaw)
    if (user.role !== 'admin') return router.push('/auth/admin-login')

    setLoaded(true)
  }, [])

  if (!loaded) return null

  return (
    <Box className="flex h-screen bg-gray-50">
      <aside className="w-[240px] bg-white shadow-md">
        {/* Sidebar */}
        <div className="p-4 font-bold">Materio Admin</div>
        {/* Menu items... */}
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="p-4 shadow bg-white">Top AppBar</header>
        <section className="p-6">{children}</section>
      </main>
    </Box>
  )
}
