import { Area } from "react-easy-crop"

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })
}

function getRadianAngle(degree: number) {
  return (degree * Math.PI) / 180
}

export async function getCroppedImg(
  imageSrc: string,
  crop: Area,
  outputWidth = 600,
  outputHeight = 800,
  rotation = 0,
  flipX = 0,
  flipY = 0
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context not available")

  const radians = getRadianAngle(rotation)
  const maxDim = Math.max(image.width, image.height)
  const safeSize = maxDim * Math.sqrt(2)
  canvas.width = safeSize
  canvas.height = safeSize

  // 👉 Center, rotate, and apply flip
  ctx.translate(safeSize / 2, safeSize / 2)
  ctx.rotate(radians)
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1)

  // ✅ Fix translation after flip
  const flipOffsetX = flipX ? -image.width : -image.width / 2
  const flipOffsetY = flipY ? -image.height : -image.height / 2
  ctx.drawImage(image, flipOffsetX, flipOffsetY)

  // ▶️ Crop area from rotated/flipped image
  const cropCanvas = document.createElement("canvas")
  cropCanvas.width = outputWidth
  cropCanvas.height = outputHeight
  const cropCtx = cropCanvas.getContext("2d")
  if (!cropCtx) throw new Error("Crop context not available")

  const centerX = safeSize / 2 - image.width / 2
  const centerY = safeSize / 2 - image.height / 2

  cropCtx.drawImage(
    canvas,
    centerX + crop.x,
    centerY + crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputWidth,
    outputHeight
  )

  return cropCanvas.toDataURL("image/jpeg")
}
