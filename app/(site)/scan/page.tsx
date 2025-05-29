"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Swal from "sweetalert2";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const yourCheckByValue = 1;
  const yourStatusValue = "completed";

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 400, height: 400 },
        aspectRatio: 1,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        setIsScanning(false);
        scanner.clear();
      },
      (error) => console.warn("QR Scan Error:", error)
    );

    return () => {
      scanner.clear();
    };
  }, [isScanning]);

  const formatDateToBangkok = () => {
    const currentDateTime = new Date();

    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("sv-SE", options);
    const formattedDateTime = formatter.format(currentDateTime);
    return formattedDateTime;
  };

  const saveData = async (stdCode: string | null) => {
    if (!stdCode) return;

    const formattedTimestamp = formatDateToBangkok();

    try {
      const response = await fetch("/api/savescan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          std_code: stdCode,
          check_by: yourCheckByValue,
          status: yourStatusValue,
          timestamp: formattedTimestamp,
          location: selectedLocation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสำเร็จ",
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        });
        setScanResult(null);
        setIsScanning(true);
      } else {
        if (data.error === "Duplicate entry") {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "มีข้อมูลแล้วในวันนี้",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">QR Code Scanner</h1>
      <Card className="w-full max-w-md p-4 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          {isScanning ? (
            <Button onClick={() => setIsScanning(false)} className="flex items-center gap-2">
              Stop Scanning
            </Button>
          ) : (
            <Button
              onClick={() => {
                setScanResult(null);
                setIsScanning(true);
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> สแกนอีกครั้ง
            </Button>
          )}

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

          {isScanning ? (
            <div id="reader" className="w-full max-w-xs" style={{ width: "100%", maxHeight: "400px" }}></div>
          ) : (
            <div className="p-2 bg-gray-200 rounded-md w-full text-center">
              <p className="text-sm font-semibold">📌 ผลลัพธ์ที่สแกนได้:</p>
              <p className="text-lg break-words text-green-600 font-bold">{scanResult}</p>
              <Button onClick={() => saveData(scanResult)} className="mt-4">
                บันทึก
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
