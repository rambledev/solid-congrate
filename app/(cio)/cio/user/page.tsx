'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

interface Member {
  id: number
  name: string
  faculty: string
  program: string
  phone: string
  password: string
  firstpass: string
  role: 'cio' | 'admin' | 'checker'
}

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [form, setForm] = useState<Member>({
    id: 0,
    name: '', faculty: '', program: '', phone: '', password: '', firstpass: '', role: 'admin'
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const showToast = (icon: 'success' | 'error' | 'warning' | 'info', title: string) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
  }

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/cio/member')
      
      if (!res.ok) {
        throw new Error('Failed to fetch members')
      }
      
      const data = await res.json()
      console.log('✅ fetched members:', data)
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
      showToast('error', 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้')
    }
  }

  const handleEdit = (member: Member) => {
    setForm(member)
    showToast('info', 'โหลดข้อมูลสำหรับแก้ไขแล้ว')
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    })

    if (!result.isConfirmed) return

    try {
      const res = await fetch(`/api/cio/member/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete member')
      }

      showToast('success', 'ลบผู้ใช้สำเร็จ!')
      fetchMembers()
    } catch (error) {
      console.error('Error deleting member:', error)
      showToast('error', 'เกิดข้อผิดพลาดในการลบผู้ใช้')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!form.name || !form.faculty || !form.program || !form.phone) {
      showToast('warning', 'กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    try {
      let res
      if (form.id) {
        res = await fetch('/api/cio/member', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
      } else {
        res = await fetch('/api/cio/member', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
      }

      if (!res.ok) {
        throw new Error('Failed to save member')
      }

      const action = form.id ? 'อัปเดต' : 'เพิ่ม'
      showToast('success', `${action}ผู้ใช้สำเร็จ!`)
      
      setForm({ id: 0, name: '', faculty: '', program: '', phone: '', password: '', firstpass: '', role: 'admin' })
      fetchMembers()
    } catch (error) {
      console.error('Error saving member:', error)
      const action = form.id ? 'อัปเดต' : 'เพิ่ม'
      showToast('error', `เกิดข้อผิดพลาดในการ${action}ผู้ใช้`)
    }
  }

  const handleRoleChange = async (id: number, newRole: 'cio' | 'admin' | 'checker') => {
    const targetMember = members.find((m) => m.id === id)
    if (!targetMember) return

    try {
      const res = await fetch('/api/cio/member', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetMember, role: newRole })
      })

      if (!res.ok) {
        throw new Error('Failed to update role')
      }

      showToast('success', 'เปลี่ยนบทบาทสำเร็จ!')
      fetchMembers()
    } catch (error) {
      console.error('Error updating role:', error)
      showToast('error', 'เกิดข้อผิดพลาดในการเปลี่ยนบทบาท')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">User Management</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="ชื่อ" 
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required
          />
          <input 
            name="faculty" 
            value={form.faculty} 
            onChange={handleChange} 
            placeholder="คณะ" 
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required
          />
          <input 
            name="program" 
            value={form.program} 
            onChange={handleChange} 
            placeholder="สาขา" 
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required
          />
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            placeholder="เบอร์โทร" 
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required
          />
          <input 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            placeholder="Password" 
            type="password"
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          <input 
            name="firstpass" 
            value={form.firstpass} 
            onChange={handleChange} 
            placeholder="Firstpass" 
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          <select 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="cio">cio</option>
            <option value="admin">admin</option>
            <option value="checker">checker</option>
          </select>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md col-span-1 md:col-span-3 transition-colors duration-200 font-medium"
          >
            {form.id ? 'บันทึกข้อมูล' : 'เพิ่มผู้ใช้'}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">ชื่อ</th>
                <th className="border border-gray-300 px-4 py-2 text-left">คณะ</th>
                <th className="border border-gray-300 px-4 py-2 text-left">สาขา</th>
                <th className="border border-gray-300 px-4 py-2 text-left">เบอร์</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                <th className="border border-gray-300 px-4 py-2 text-center">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} className="text-sm hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{i + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{m.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{m.faculty}</td>
                  <td className="border border-gray-300 px-4 py-2">{m.program}</td>
                  <td className="border border-gray-300 px-4 py-2">{m.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      m.role === 'cio' ? 'bg-purple-100 text-purple-800' :
                      m.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
                        title="แก้ไข"
                      >
                        <span>✏️</span>
                        <span>แก้ไข</span>
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
                        title="ลบ"
                      >
                        <span>🗑️</span>
                        <span>ลบ</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={7} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                    ไม่มีข้อมูลผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 