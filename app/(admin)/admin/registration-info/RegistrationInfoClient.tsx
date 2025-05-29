'use client'

import { useEffect, useState } from 'react'
import html2pdf from 'html2pdf.js'
import Papa from 'papaparse'

function getCostOptionText(option: string) {
    switch (option) {
      case '1':
        return 'ลงทะเบียนปกติ'
      case '2':
        return 'ลงทะเบียน+เช่าชุดครุย'
      case '3':
        return 'ลงทะเบียน+ตัดชุดครุย'
      default:
        return '-'
    }
  }
  

type Registration = {
  std_code: string
  name_th: string
  faculty: string
  program: string
  phone: string
  academic_year: string
  cost_option : string
  price : string
}

export default function RegistrationInfoPage() {
  const [data, setData] = useState<Registration[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterField, setFilterField] = useState('name_th')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/registration')
      const json = await res.json()
      if (Array.isArray(json)) {
        setData(json)
      } else if (Array.isArray(json.data)) {
        setData(json.data)
      } else {
        setData([])
      }
    }
    fetchData()
  }, [])

  const filteredData = data.filter((item) =>
    item[filterField as keyof Registration]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastRow = rowsPerPage === -1 ? filteredData.length : currentPage * rowsPerPage
  const indexOfFirstRow = rowsPerPage === -1 ? 0 : indexOfLastRow - rowsPerPage
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow)

  const totalPage = rowsPerPage === -1 ? 1 : Math.ceil(filteredData.length / rowsPerPage)

  const handlePrint = () => {
    const table = document.getElementById('registration-table')
    if (table) {
      const opt = {
        margin: 0.5,
        filename: 'registration_info.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      }
      html2pdf().set(opt).from(table).save()
    }
  }

  const handleExportCSV = () => {
    const csv = Papa.unparse(currentRows)
    const bom = '\uFEFF'
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'registration_info.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

      
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">ข้อมูลการลงทะเบียน</h1>

      {/* Search + Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        <div className="flex flex-wrap space-x-2 items-center">
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="std_code">รหัสนักศึกษา</option>
            <option value="name_th">ชื่อ-นามสกุล</option>
            <option value="faculty">คณะ</option>
            <option value="program">สาขา</option>
            <option value="cost_option">ตัวเลือก</option>
            <option value="price">ราคา</option>
          </select>

          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="border rounded px-3 py-2 text-gray-700"
          />
        </div>

        <div className="flex flex-wrap items-center space-x-2">
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            ปริ้น
          </button>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Export Excel
          </button>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">แสดง:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                const value = e.target.value
                setRowsPerPage(value === 'all' ? -1 : parseInt(value))
                setCurrentPage(1)
              }}
              className="border rounded px-2 py-1 text-gray-700"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">ทั้งหมด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" id="registration-table">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="text-left text-gray-500 uppercase text-sm border-b">
              <th className="py-3 px-6 border">รหัสนักศึกษา</th>
              <th className="py-3 px-6 border">ชื่อ-นามสกุล</th>
              <th className="py-3 px-6 border">คณะ</th>
              <th className="py-3 px-6 border">สาขา</th>
              <th className="py-3 px-6 border">ตัวเลือก</th>
              <th className="py-3 px-6 border">ราคา</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr key={index} className="border hover:bg-gray-50">
                <td className="py-4 px-6 border">{item.std_code}</td>
                <td className="py-4 px-6 border">{item.name_th}</td>
                <td className="py-4 px-6 border">{item.faculty}</td>
                <td className="py-4 px-6 border">{item.program}</td>
                <td className="py-4 px-6 border">{getCostOptionText(item.cost_option)}</td>

                <td className="py-4 px-6 border">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {rowsPerPage !== -1 && totalPage > 1 && (
        <div className="flex justify-center mt-6 flex-wrap gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ←
          </button>

          {[...Array(totalPage)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-2 rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
            disabled={currentPage === totalPage}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
