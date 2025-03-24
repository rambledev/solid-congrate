"use client";

import { useEffect, useRef, useState } from "react";

const ScanPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraAccessible, setIsCameraAccessible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraAccessible(true);
      } catch (error) {
        setErrorMessage("Cannot access the camera. Please check your permissions.");
      }
    };
    startCamera();

    // Cleanup function
    return () => {
      if (videoRef.current) {
        const tracks = videoRef.current.srcObject?.getTracks();
        tracks?.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">QR Code Scanner</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isCameraAccessible ? (
        <div className="mt-4">
          <video ref={videoRef} className="border" width="100%" height="auto"></video>
          {/* ที่นี่คุณสามารถเพิ่มตรรกะการแสกน QR Code */}
        </div>
      ) : (
        <p>Requesting camera access...</p>
      )}
    </main>
  );
};

export default ScanPage;