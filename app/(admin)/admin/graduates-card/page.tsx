'use client'

import { useEffect, useState, useRef } from 'react'
import html2canvas from 'html2canvas'

type Graduate = {
  std_code: string
  name_th: string
  faculty: string
  program: string
  img: string
  fac_type: string
}

export default function GraduatesCardPage() {
  const [data, setData] = useState<Graduate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterField, setFilterField] = useState('name_th')

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/graduates')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    }
    fetchData()
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadSVGAsPNG = (id: string) => {
    const element = document.getElementById(`card-${id}`)
  
    if (!element) return
  
    if (element instanceof SVGSVGElement) {
      const svgData = new XMLSerializer().serializeToString(element)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
  
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = element.width.baseVal.value
        canvas.height = element.height.baseVal.value
  
        const ctx = canvas.getContext('2d')
        if (!ctx) return
  
        ctx.drawImage(img, 0, 0)
  
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngFile
        downloadLink.download = `graduate-card-${id}.png`
        downloadLink.click()
  
        URL.revokeObjectURL(url)
      }
  
      img.src = url
    } else {
      console.error(`Element #card-${id} is not an SVGSVGElement.`)
    }
  }
  

  const filteredData = data.filter((grad) =>
    grad[filterField as keyof Graduate]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex flex-wrap items-center justify-between mb-8">
        {/* ส่วนซ้าย: ค้นหา */}
        <div className="flex space-x-2">
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="std_code">รหัสนักศึกษา</option>
            <option value="name_th">ชื่อ-นามสกุล</option>
            <option value="faculty">คณะ</option>
            <option value="program">สาขา</option>
          </select>

          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 text-gray-700"
          />
        </div>

        {/* ส่วนขวา: ปุ่มปริ้น */}
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ปริ้นบัตรทั้งหมด
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredData.map((grad) => (
          <div key={grad.std_code}>
            <div className="flex flex-row items-start gap-8" style={{ height: '732px' }}>
              
              {/* คอลัมน์ซ้าย: ข้อมูลบัณฑิต */}
              <div
                className="text-gray-700 space-y-2 text-[16px]"
                style={{ width: '40%' }}
              >
                <p><strong>รหัสนักศึกษา:</strong> {grad.std_code}</p>
                <p><strong>ชื่อ-นามสกุล:</strong> {grad.name_th}</p>
                <p><strong>คณะ:</strong> {grad.faculty}</p>
                <p><strong>สาขา:</strong> {grad.program}</p>

                {/* ปุ่มดาวน์โหลดรูปบัตร */}
                <button
  onClick={() => handleDownloadSVGAsPNG(grad.std_code)}
  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
>
  ดาวน์โหลดรูปบัตร
</button>

              </div>

              {/* คอลัมน์ขวา: SVG บัตร */}
              
              <svg
  id={`card-${grad.std_code}`}
  width="1157"
  height="732"
  viewBox="0 0 1157 732"
  xmlns="http://www.w3.org/2000/svg"
  className="border-2 border-gray-400 bg-white"
>

  {/* โลโก้ */}
  <foreignObject x="50" y="10" width="250" height="250" xmlns="http://www.w3.org/1999/xhtml">
    <div style={{ width: '250px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
      <img
        src="/logo_rmu.png"
        alt="Logo"
        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
      />
    </div>
  </foreignObject>

  {/* ข้อความหัวบัตร */}
  <text x="578" y="10" textAnchor="middle" fontSize="38" fontWeight="bold">บัตรประจำตัวบัณฑิต</text>
  <text x="578" y="60" textAnchor="middle" fontSize="34" fontWeight="bold">มหาวิทยาลัยราชภัฏมหาสารคาม</text>
  <text x="578" y="110" textAnchor="middle" fontSize="30">พิธีพระราชทานปริญญาบัตร</text>
  <text x="578" y="160" textAnchor="middle" fontSize="30">ประจำปีการศึกษา 2568</text>

  {/* รูปนักศึกษา */}
  <foreignObject x="850" y="10" width="250" height="280" xmlns="http://www.w3.org/1999/xhtml">
    <div style={{ width: '250px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={grad.img ? `/uploads/${grad.img}` : '/blank.png'}
        alt="Graduate"
        style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
      />
    </div>
  </foreignObject>

  {/* กลุ่ม QR และข้อมูลบัณฑิต */}
  <g>
    {/* QR Code */}
    <foreignObject x="100" y="350" width="300" height="300" xmlns="http://www.w3.org/1999/xhtml">
      <div style={{ width: '300px', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${grad.std_code}`}
          alt="QR Code"
          width="280"
          height="280"
        />
      </div>
    </foreignObject>

    {/* ข้อมูลบัณฑิต */}
    <text x="580" y="350" textAnchor="middle" fontSize="34" fontWeight="bold">{grad.name_th}</text>
    <text x="580" y="400" textAnchor="middle" fontSize="30">{grad.fac_type}</text>
    <text x="580" y="450" textAnchor="middle" fontSize="28">ลำดับที่: n/a</text>
  </g>

  {/* รหัสนักศึกษา */}
  <text x="165" y="690" fontSize="26" fontWeight="bold">{grad.std_code}</text>

  {/* ระดับปริญญา */}
  <text x="180" y="720" fontSize="26" fontWeight="bold">[ ปริญญาตรี ]</text>

  {/* ลายเซ็นผู้อนุญาต */}
  <text x="1100" y="620" fontSize="22" textAnchor="end">ผู้อนุญาต...........................................</text>
  <text x="1100" y="650" fontSize="22" textAnchor="end">ผู้ช่วยศาสตราจารย์ ดร.เนตรชนก จันทร์สว่าง</text>
  <text x="1100" y="680" fontSize="22" textAnchor="end">คณบดีคณะวิทยาศาสตร์และเทคโนโลยี</text>
  <text x="1100" y="710" fontSize="22" textAnchor="end">รักษาการอธิการบดีมหาวิทยาลัยราชภัฏมหาสารคาม</text>

</svg>


            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
