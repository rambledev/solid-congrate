"use client"

import React, { useCallback, useState, useEffect } from "react"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "./utils/cropImage"
import { useSearchParams, useRouter } from "next/navigation"

export default function AdminPhotoPage() {
  const searchParams = useSearchParams()
  const std_code = searchParams.get("std_code")
  const router = useRouter()

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipX, setFlipX] = useState(0)
  const [flipY, setFlipY] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)

  const onCropComplete = useCallback(
    async (_: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels)
      if (imageSrc) {
        const cropped = await getCroppedImg(imageSrc, croppedPixels, 600, 800, rotation, flipX, flipY)
        setCroppedImage(cropped)
      }
    },
    [imageSrc, rotation, flipX, flipY]
  )

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return alert("ยังไม่ได้ครอปภาพ")
    try {
      setUploading(true)
      const cropped = await getCroppedImg(imageSrc!, croppedAreaPixels, 600, 800, rotation, flipX, flipY)
      setCroppedImage(cropped)

      const blob = await (await fetch(cropped)).blob()
      const formData = new FormData()
      formData.append("image", blob)
      formData.append("std_code", std_code || "")

      await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      })

      setUploadSuccess(true)
    } catch (e) {
      console.error(e)
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูป")
    } finally {
      setUploading(false)
    }
  }, [imageSrc, croppedAreaPixels, std_code, rotation, flipX, flipY])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setCroppedImage(null)
      setUploadSuccess(false)
    }
  }

  useEffect(() => {
    if (uploadSuccess && std_code) {
      const timeout = setTimeout(() => {
        router.push(`/admin/edit?std_code=${std_code}`)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [uploadSuccess, std_code, router])

  useEffect(() => {
    if (std_code) {
      fetch(`/uploads/${std_code}.jpg`).then((res) => {
        if (res.ok) setExistingImageUrl(`/uploads/${std_code}.jpg`)
      })
    }
  }, [std_code])

  const renderSlider = (
    label: string,
    value: number,
    setValue: (val: number) => void,
    min = -100,
    max = 100
  ) => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setValue((prev) => Math.max(prev - 1, min))}
          className="px-2 py-1 bg-gray-200 rounded"
        >−</button>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="flex-1 accent-blue-600"
        />
        <button
          onClick={() => setValue((prev) => Math.min(prev + 1, max))}
          className="px-2 py-1 bg-gray-200 rounded"
        >+</button>
      </div>
      <div className="text-center text-sm text-gray-600">{label} {value}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-white px-4 py-10">
      <div className="max-w-lg mx-auto bg-white text-black p-6 rounded shadow relative">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-700">เลือก/ปรับภาพ</h1>
        {!imageSrc ? (
          <input type="file" accept="image/*" onChange={handleImageChange} className="mb-6 w-full" />
        ) : (
          <>
            <div className="relative w-full h-[500px] bg-gray-100 mb-4 rounded overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={3 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                objectFit="contain"
                cropShape="rect"
                flip={{ horizontal: flipX >= 1, vertical: flipY >= 1 }}
              />
            </div>

            <div className="flex flex-col gap-4 mb-4">
              {renderSlider("Zoom", zoom, setZoom, 1, 3)}
              {renderSlider("หมุน (Rotation)", rotation, setRotation, -180, 180)}
              {renderSlider("Flip แนวนอน", flipX, setFlipX)}
              {renderSlider("Flip แนวตั้ง", flipY, setFlipY)}
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => {
                  setImageSrc(null)
                  setCrop({ x: 0, y: 0 })
                  setZoom(1)
                  setRotation(0)
                  setFlipX(0)
                  setFlipY(0)
                  setCroppedImage(null)
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >ปรับใหม่</button>
              <button
                onClick={showCroppedImage}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >ยืนยันและอัปโหลด</button>
            </div>

            {croppedImage && (
              <div className="mt-4">
                <p className="mb-2 text-center">รูปหลัง Crop (600×800):</p>
                <div className="w-[150px] h-[200px] mx-auto border border-black rounded shadow overflow-hidden">
                  <img
                    src={croppedImage}
                    alt="Cropped"
                    onError={(e) => (e.currentTarget.src = "/blank.png")}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
