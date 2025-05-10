'use client'

import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'

export default function AdminScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState<boolean>(true)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const yourCheckByValue = 1
  const yourStatusValue = "completed"

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null
  
    if (isScanning) {
      scanner = new Html5QrcodeScanner('reader', {
        fps: 10,
        qrbox: { width: 400, height: 400 },
        aspectRatio: 1,
      }, false)
  
      scanner.render(
        (decodedText) => {
          setScanResult(decodedText)
          setIsScanning(false)
          scanner?.clear()
        },
        (error) => console.warn('QR Scan Error:', error)
      )
    }
  
    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error('Clear failed:', e))
        const el = document.getElementById('reader')
        if (el) el.innerHTML = '' // ⛔ เคลียร์ DOM ตรง ๆ ป้องกัน render ซ้ำ
      }
    }
  }, [isScanning])
  

  const formatDateToBangkok = () => {
    const currentDateTime = new Date()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    
    const formatter = new Intl.DateTimeFormat('sv-SE', options)
    const formattedDateTime = formatter.format(currentDateTime).replace('T', ' ')
    return formattedDateTime
  }

  const saveData = async (stdCode: string | null) => {
    if (!stdCode) return

    const formattedTimestamp = formatDateToBangkok()

    try {
      const response = await fetch('/api/savescan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          std_code: stdCode,
          check_by: yourCheckByValue,
          status: yourStatusValue,
          timestamp: formattedTimestamp,
          location: selectedLocation,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        })
        setScanResult(null)
        setIsScanning(true)
      } else {
        if (data.error === 'Duplicate entry') {
          Swal.fire({
            icon: 'error',
            title: 'มีข้อมูลอยู่แล้วในวันนี้',
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          throw new Error(data.message)
        }
      }
    } catch (error) {
      console.error('Error saving data:', error)
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">สแกน QR Code</h1>

      <Card className="w-full max-w-md p-6 space-y-4 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          {/* Dropdown Location */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">- เลือกสถานที่ -</option>
            <option value="คณะเทคโนโลยีสารสนเทศ">คณะเทคโนโลยีสารสนเทศ</option>
            <option value="กองพัฒ">กองพัฒ</option>
            <option value="หอประชุม">หอประชุม</option>
          </select>

          {/* Scan or Result */}
          {isScanning ? (
            <div id="reader" className="w-full" style={{ maxWidth: 400 }} />
          ) : (
            <div className="w-full text-center p-4 bg-gray-200 rounded-md">
              <p className="text-sm font-semibold mb-2">📌 ผลลัพธ์ที่สแกนได้:</p>
              <p className="text-lg text-green-600 font-bold break-words">{scanResult}</p>
              
              <button onClick={() => saveData(scanResult)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              บันทึก
          </button>
            </div>
          )}

          {/* Control Buttons */}
          {isScanning ? (
            <button onClick={() => setIsScanning(false)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            หยุดสแกน
        </button>
            
          ) : (
            <button onClick={() => {
              setScanResult(null)
              setIsScanning(true)
            }} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              สแกนอีกครั้ง
          </button>
            
          )}
        </div>
      </Card>
    </div>
  )
}
