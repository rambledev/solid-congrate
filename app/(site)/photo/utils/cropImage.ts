// utils/cropImage.ts

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  outputWidth: number,
  outputHeight: number,
  rotation: number = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("ไม่สามารถสร้าง context ของ canvas ได้");

  // ตั้งค่าขนาดผลลัพธ์
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const centerX = image.width / 2;
  const centerY = image.height / 2;

  ctx.save();

  // ย้าย origin ไปที่กลางรูปภาพก่อนหมุน
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // วาดภาพที่ถูกครอปลงบน canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  ctx.restore();

  return canvas.toDataURL("image/jpeg");
}

// Helper: โหลดรูปจาก base64 หรือ URL
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
  });
}
