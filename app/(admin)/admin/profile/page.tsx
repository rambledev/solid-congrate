'use client'

import { useEffect, useState } from 'react'

type ProfileData = {
  id: number
  name: string
  faculty: string
  program: string
  phone: string
  role: string
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/admin/profile')
      const data = await res.json()
      setProfile(data)
    }

    fetchProfile()
  }, [])

  if (!profile) return <div className="text-center p-4">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">ข้อมูลโปรไฟล์</h1>
      <div className="space-y-4">
        <ProfileItem label="ชื่อ - นามสกุล" value={profile.name} />
        <ProfileItem label="คณะ" value={profile.faculty} />
        <ProfileItem label="สาขา" value={profile.program} />
        <ProfileItem label="เบอร์โทรศัพท์" value={profile.phone} />
        <ProfileItem label="สิทธิ์การใช้งาน" value={translateRole(profile.role)} />
      </div>
    </div>
  )
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function translateRole(role: string) {
  switch (role) {
    case 'admin':
      return 'ผู้ดูแลระบบ'
    case 'member':
      return 'สมาชิก'
    case 'cio':
      return 'CIO'
    default:
      return role
  }
}
