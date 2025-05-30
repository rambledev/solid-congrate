"use client";

import React, { useCallback, useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./utils/cropImage";
import { useSearchParams, useRouter } from "next/navigation";

export default function PhotoPage() {
  const searchParams = useSearchParams();
  const std_code = searchParams.get("std_code");
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // หมุนแกน Z
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const onCropComplete = useCallback(
    async (_, croppedPixels) => {
      setCroppedAreaPixels(croppedPixels);
      if (imageSrc) {
        const cropped = await getCroppedImg(imageSrc, croppedPixels, 600, 800, rotation);
        setCroppedImage(cropped);
      }
    },
    [imageSrc, rotation]
  );

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) {
      alert("ยังไม่ได้ครอปภาพ");
      return;
    }

    if (croppedAreaPixels.width < 600 || croppedAreaPixels.height < 800) {
      alert("ขนาดส่วนที่ครอปเล็กเกินไป อาจทำให้ภาพเบลอ");
    }

    try {
      setUploading(true);
      const cropped = await getCroppedImg(imageSrc!, croppedAreaPixels, 600, 800, rotation);
      setCroppedImage(cropped);

      const blob = await (await fetch(cropped)).blob();
      const formData = new FormData();
      formData.append("image", blob);
      formData.append("std_code", std_code || "");

      await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      setUploadSuccess(true);
    } catch (e) {
      console.error(e);
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูป");
    } finally {
      setUploading(false);
    }
  }, [imageSrc, croppedAreaPixels, rotation, std_code]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCroppedImage(null);
      setUploadSuccess(false);
    };
  };

  useEffect(() => {
    if (uploadSuccess && std_code) {
      const timeout = setTimeout(() => {
        router.push(`/detail?std_code=${std_code}`);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [uploadSuccess, std_code, router]);

  useEffect(() => {
    if (std_code) {
      fetch(`/uploads/${std_code}.jpg`).then((res) => {
        if (res.ok) setExistingImageUrl(`/uploads/${std_code}.jpg`);
      });
    }
  }, [std_code]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white px-4 py-10">
      <div className="max-w-lg mx-auto bg-white text-black p-6 rounded shadow relative">
        <button
          onClick={() => router.push(`/detail?std_code=${std_code}`)}
          className="text-white bg-green-800 px-3 py-1 rounded flex items-center gap-1 hover:bg-green-900 mb-4"
        >
          <span>←</span> กลับ
        </button>

        <h1 className="text-2xl font-bold mb-2 text-green-800 text-center mt-2">
          เลือกรูปภาพนักศึกษา
        </h1>
        <p className="text-red-600 text-sm mb-4 text-center">
          * ต้องเป็นภาพถ่ายหน้าตรงสวมชุดครุยวิทยฐานะที่ถูกต้องตามระเบียบมหาวิทยาลัยราชภัฏมหาสารคาม
        </p>
        <div className="text-center mb-4">
          <img src="/ex.png" alt="example" />
          <span className="text-red-500 block mt-1">ตัวอย่างภาพที่ใช้วิธีการถ่ายจากมือถือ</span>
        </div>

        {existingImageUrl && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-700 mb-1">รูปภาพเดิมที่มีอยู่:</p>
            <img
              src={existingImageUrl}
              alt="รูปภาพเดิม"
              onError={(e) => (e.currentTarget.src = "/blank.png")}
              className="w-[150px] h-[200px] object-cover border border-black mx-auto rounded shadow"
            />
          </div>
        )}

        <p className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-3 py-2 text-sm mb-4">
          ⚠ กรุณาเลือกรูปที่มีขนาดอย่างน้อย <strong>900 × 1200 พิกเซล</strong> เพื่อให้สามารถครอปได้อย่างชัดเจน และได้ภาพผลลัพธ์ 600 × 800 พิกเซลที่มีคุณภาพ
        </p>

        {!imageSrc ? (
          <div className="mb-6 text-center">
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded cursor-pointer"
          >
            เลือกรูปภาพ
          </label>
        </div>
        
        ) : (
          <>
            <div className="relative w-full h-[450px] bg-gray-100 mb-4 rounded overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={3 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center text-sm">
              <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                Zoom +
              </button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.1, 1))} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                Zoom −
              </button>
              <button
  onClick={() => setRotation((r) => (r + 1) % 360)}
  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
>
  Rotate +
</button>
<button
  onClick={() => setRotation((r) => (r - 1 + 360) % 360)}
  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
>
  Rotate −
</button>


            </div>

            {uploading ? (
              <p className="text-center text-green-700 font-semibold">กำลังอัปโหลด...</p>
            ) : uploadSuccess ? (
              <div className="text-center text-green-700 font-semibold mb-4">✅ อัปโหลดรูปภาพสำเร็จแล้ว</div>
            ) : (
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                    setRotation(0);
                    setCroppedImage(null);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  ปรับใหม่
                </button>

                <button
                  onClick={showCroppedImage}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  ยืนยันและอัปโหลด
                </button>
              </div>
            )}

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
  );
}
