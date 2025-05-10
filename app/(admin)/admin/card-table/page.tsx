'use client'

import React, { useEffect, useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { useQRCode } from 'next-qrcode'
import jsPDF from 'jspdf'


interface Graduate {
  std_code: string
  name_th: string
  faculty: string
  program: string
  work_status: string
  regist_status: string
  img: string
  fac_type: string
  num: string
  note: string
  citizen: string
  group_name: string 
}



export default function CardTablePage() {
  const [graduates, setGraduates] = useState<Graduate[]>([])
  const [filteredGraduates, setFilteredGraduates] = useState<Graduate[]>([])
  const [facultyOptions, setFacultyOptions] = useState<string[]>([])
  const [programOptions, setProgramOptions] = useState<string[]>([])
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const { Canvas } = useQRCode()

  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        setIsLoading(true)
        setLoadingMessage('กำลังโหลดข้อมูลผู้สำเร็จการศึกษา...')
        const res = await fetch('/api/graduates')
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setGraduates(json.data)
          setFilteredGraduates(json.data)
          setFacultyOptions(Array.from(new Set(json.data.map((g: Graduate) => g.faculty))) as string[])
          setProgramOptions(Array.from(new Set(json.data.map((g: Graduate) => g.program))) as string[])
        } else {
          console.error(json.message)
        }
      } catch (err) {
        console.error('Error fetching graduates:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchGraduates()
  }, [])

  useEffect(() => {
    let result = graduates
    if (selectedFaculty) result = result.filter(g => g.faculty === selectedFaculty)
    if (selectedProgram) result = result.filter(g => g.program === selectedProgram)
    setFilteredGraduates(result)
  }, [selectedFaculty, selectedProgram, graduates])

  const handleDownloadCard = async (stdCode: string) => {
    const card = cardRefs.current[stdCode]
    if (card) {
      const canvas = await html2canvas(card, { scale: 2, useCORS: true })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `${stdCode}-card.png`
      link.click()
    }
  }

  const handleDownloadAll = async () => {
    setIsLoading(true)
    setLoadingMessage('กำลังดาวน์โหลดการ์ดทั้งหมด...')
    for (const grad of filteredGraduates) {
      await handleDownloadCard(grad.std_code)
    }
    setIsLoading(false)
  }

  const handleExportPDF = async () => {
    setIsLoading(true)
    setLoadingMessage('กำลังสร้างไฟล์ PDF... กรุณารอสักครู่ (อาจใช้เวลานานหากรูปภาพเยอะ)')
  
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const margin = 3
    const cardWidth = 100.5
    const cardHeight = 61.8
    const colCount = 2
    const rowCount = 4
    let x = margin
    let y = margin
    let cardPerPage = 0
    let pageCount = 1
  
    const totalPages = Math.ceil(filteredGraduates.length / (colCount * rowCount))

    const groupName = filteredGraduates[0]?.group_name || 'กลุ่มไม่ระบุ'
  
    console.log('Exporting group:', groupName)
    const addHeader = () => {
      pdf.setFontSize(16)
      pdf.text(`กลุ่ม: ${groupName}`, margin, 10)
    }
    
  
    const addFooter = (pageNum: number) => {
      const pageHeight = pdf.internal.pageSize.getHeight()
      const pageWidth = pdf.internal.pageSize.getWidth()
      pdf.setFont('THSarabunNew')
      pdf.setFontSize(12)
    
      // ➔ เพิ่มบรรทัดนี้: แสดงชื่อกลุ่มที่มุมซ้ายล่าง
      pdf.text(` ${groupName}`, margin, pageHeight - 10)
    
      // ➔ เลขหน้า (อยู่ขวาล่าง)
      const pageText = `${pageNum} / ${totalPages}`
      pdf.text(pageText, pageWidth - margin - 20, pageHeight - 10)
    }
    
    
  
    addHeader() // ✅ หัวกระดาษหน้าแรก
  
    for (let i = 0; i < filteredGraduates.length; i++) {
      const grad = filteredGraduates[i]
      const card = cardRefs.current[grad.std_code]
      if (!card) continue
  
      const canvas = await html2canvas(card, { scale: 3, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
  
      pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight)
  
      x += cardWidth + margin
      if ((i + 1) % colCount === 0) {
        x = margin
        y += cardHeight + margin
      }
  
      cardPerPage++
      if (cardPerPage >= colCount * rowCount && i !== filteredGraduates.length - 1) {
        // ใส่ footer ก่อนเปลี่ยนหน้า
        addFooter(pageCount)
  
        pdf.addPage()
        pageCount++
  
        // Reset layout
        x = margin
        y = margin
        cardPerPage = 0
  
        addHeader() // หัวกระดาษทุกหน้าใหม่
      }
    }
  
    // Footer หน้าสุดท้าย
    addFooter(pageCount)
  
    pdf.save('graduate-cards.pdf')
    setIsLoading(false)
  }
  

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6">
      {/* Progress Dialog */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow text-center">
            <div className="mb-2">
              <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
            <div className="text-gray-700">{loadingMessage}</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border px-4 py-2 rounded"
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
        >
          <option value="">-- เลือกคณะ --</option>
          {facultyOptions.map(fac => <option key={fac}>{fac}</option>)}
        </select>
        <select
          className="border px-4 py-2 rounded"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          <option value="">-- เลือกสาขา --</option>
          {programOptions.map(prog => <option key={prog}>{prog}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Export PDF</button>
      </div>

      <div className="grid grid-cols-2 gap-6 print:grid-cols-2 font-sarabun">
        {filteredGraduates.map((grad) => (
          <div key={grad.std_code} className="break-inside-avoid">
            <div
  ref={(el) => { cardRefs.current[grad.std_code] = el }}
  className="w-[650px] h-[400px] bg-white border border-gray-400 shadow-md mx-auto flex flex-col justify-between overflow-hidden p-2"
>

              {/* Header */}
              <div className="flex items-start border bg-green-800 text-white">

  <div className="relative border bg-white w-[70px] h-[70px] overflow-hidden box-border self-end">
    <img
      src="/logo_rmu.png"
      alt="logo"
      className="absolute inset-0 w-full h-full object-cover scale-y-95"
    />
  </div>

  <div className="ml-2 text-[14px] leading-[16px] font-sarabun p-0 pt-1">
    <div className="font-bold">บัตรประจำตัวผู้เข้ารับพระราชทานปริญญาบัตร</div>
    <div>พิธีพระราชทานปริญญาบัตรแก่ผู้สำเร็จการศึกษาจากมหาวิทยาลัยราชภัฏมหาสารคาม</div>
    <div>กลุ่มภาคตะวันออกเฉียงเหนือ ระหว่างวันที่ 21-24 สิงหาคม 2568</div>
  </div>

</div>



              {/* Content */}
              <div className="grid grid-cols-3 gap-2 h-full">
                <div className="col-span-2 flex flex-col justify-between items-start text-[13px]">
                  <div className="w-full flex flex-col items-center">
                    <div className="font-bold text-[24px] mt-3 leading-[50px] text-black">{grad.name_th}</div>
                    <div className="text-[20px] leading-[10px] text-black">{grad.fac_type}</div>
                    <div className="mt-10 text-[16px] text-center leading-[22px]">
                      <div className="text-[18px] leading-[24px] font-bold text-black">ผู้อนุญาต......................</div>
                      <div className="text-[18px] leading-[24px] text-black">(นางเนตรชนก จันทร์สว่าง)</div>
                      <div className="text-[18px] leading-[24px] text-black">รักษาการอธิการบดีมหาวิทยาลัยราชภัฏมหาสารคาม</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start space-y-1">
                  <div className="bg-orange-500 text-white px-3 py-2 rounded text-[22px] leading-[26px] flex items-center justify-center min-h-[50px]">
  ปริญญาตรี
</div>



  <div className="flex space-x-2 text-[18px]">
    <div className='text-black'>ลำดับที่: {grad.num}</div>
    <div className='text-black'>เกียรตินิยม: {grad.note || "-"}</div>
  </div>
</div>

                </div>

                <div className="flex flex-col justify-start items-center h-full">
                  <div className="w-[150px] h-[170px]">
                    <img
                      src={grad.img && grad.img.trim() !== "" ? "/uploads/" + grad.img.trim() : "/blank.png"}
                      alt="student"
                      className="w-full h-full object-cover rounded shadow-md"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="w-[150px] h-[50px] mt-1 mb-1">
                    <Canvas
                      text={grad.citizen}
                      options={{
                        errorCorrectionLevel: 'M',
                        margin: 1,
                        scale: 12,
                        width: 145,
                        color: { dark: '#000000', light: '#ffffff' },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
