import { Area } from "react-easy-crop";

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: Area,
  outputWidth = 600,
  outputHeight = 800
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = pixelCrop.width;
      cropCanvas.height = pixelCrop.height;
      const cropCtx = cropCanvas.getContext("2d");

      if (!cropCtx) return reject("Canvas context not available");

      // ตัดภาพจาก pixelCrop
      cropCtx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // จากนั้น resize (ถ้าจำเป็น)
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = outputWidth;
      finalCanvas.height = outputHeight;
      const finalCtx = finalCanvas.getContext("2d");

      if (!finalCtx) return reject("Final canvas context not available");

      finalCtx.drawImage(
        cropCanvas,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      resolve(finalCanvas.toDataURL("image/jpeg"));
    };

    image.onerror = () => reject("Failed to load image");
  });
};
