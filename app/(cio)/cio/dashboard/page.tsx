'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Cio/Sidebar'
import DashboardStats from '@/components/Cio/DashboardStats'
import Charts from '@/components/Cio/Charts'
import InvoiceTable from '@/components/Cio/InvoiceTable'
import RelatedApps from '@/components/Cio/RelatedApps'

export default function CIODashboard() {
  const [selectedYear, setSelectedYear] = useState('2023')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    degreeStats: Record<string, number>
    honorStats: Record<string, number>
    registrationStatus: { registered: number; not_registered: number }
    surveyStatus: { surveyed: number; not_surveyed: number }
    graduationStatus: Record<string, number>
  } | null>(null)

  const [filters, setFilters] = useState({ fac_type: '', faculty: '', program: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(filters)
        const res = await fetch(`/api/dashboard?${params.toString()}`)
        const json = await res.json()
        console.log('📦 dashboard response:', json)

        if (json.success) {
          setData(json)
        } else {
          console.warn('⚠️ API returned success: false')
          setData(null)
        }
      } catch (err) {
        console.error('❌ Failed to fetch dashboard data:', err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
        </div>

        {/* Search Filters */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select name="fac_type" value={filters.fac_type} onChange={handleChange} className="p-2 border rounded">
            <option value="">เลือกวุฒิ</option>
            <option value="ปริญญาตรี">ปริญญาตรี</option>
            <option value="ปริญญาโท">ปริญญาโท</option>
            <option value="ปริญญาเอก">ปริญญาเอก</option>
          </select>

          <select name="faculty" value={filters.faculty} onChange={handleChange} className="p-2 border rounded">
            <option value="">เลือกคณะ</option>
            <option value="ครุศาสตร์">ครุศาสตร์</option>
            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
            <option value="บริหารธุรกิจ">บริหารธุรกิจ</option>
          </select>

          <select name="program" value={filters.program} onChange={handleChange} className="p-2 border rounded">
            <option value="">เลือกสาขา</option>
            <option value="การประถมศึกษา">การประถมศึกษา</option>
            <option value="วิทยาการคอมพิวเตอร์">วิทยาการคอมพิวเตอร์</option>
            <option value="การตลาด">การตลาด</option>
          </select>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">ค้นหา</button>
        </form>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : data ? (
          <>
            <DashboardStats
              degreeStats={data.degreeStats}
              honorStats={data.honorStats}
            />

            <div className="w-full mb-6 md:mb-8">
              <Charts
                registrationStatus={data.registrationStatus}
                surveyStatus={data.surveyStatus}
                graduationStatus={data.graduationStatus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <InvoiceTable />
              <RelatedApps />
            </div>
          </>
        ) : (
          <p className="text-red-500">ไม่พบข้อมูล หรือเกิดข้อผิดพลาดในการโหลด</p>
        )}
      </div>
    </div>
  )
}
