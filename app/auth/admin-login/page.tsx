'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
} from '@mui/material'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok && data.success) {
      if (data.user.role !== 'admin') {
        setError('ไม่ใช่ผู้ดูแลระบบ')
        return
      }

      sessionStorage.setItem('user', JSON.stringify(data.user))
      router.push('/admin/dashboard')
    } else {
      setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ')
    }
  }

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent>
          <Typography variant="h5" className="mb-6 font-bold text-center">
            เข้าสู่ระบบผู้ดูแลระบบ
          </Typography>

          <form onSubmit={handleLogin} className="space-y-4">
            <TextField
              label="รหัสผู้ใช้"
              variant="outlined"
              fullWidth
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <TextField
              label="รหัสผ่าน"
              type="password"
              variant="outlined"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && (
              <Typography className="text-red-500 text-sm">{error}</Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              className="mt-2"
            >
              เข้าสู่ระบบ
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
