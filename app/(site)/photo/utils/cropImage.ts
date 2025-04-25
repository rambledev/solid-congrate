import { Area } from "react-easy-crop";

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: Area,
  outputSize = 600 // 👉 ค่า default = 600x600 px
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Canvas context not available");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputSize,
        outputSize
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };

    image.onerror = () => reject("Failed to load image");
  });
};
