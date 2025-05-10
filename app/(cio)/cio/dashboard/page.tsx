'use client'

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* การ์ด: ผู้ใช้งานทั้งหมด */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">ผู้ใช้งานทั้งหมด</h2>
        <p className="text-4xl font-bold text-indigo-600">1,250</p>
      </div>

      {/* การ์ด: ยอดขายวันนี้ */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">ยอดขายวันนี้</h2>
        <p className="text-4xl font-bold text-green-500">฿24,000</p>
      </div>

      {/* การ์ด: รายการที่รอดำเนินการ */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">รายการที่รอดำเนินการ</h2>
        <p className="text-4xl font-bold text-red-500">32</p>
      </div>
    </div>
  )
}
