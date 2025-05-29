// app/(site)/photo/page.tsx
import { Suspense } from "react"
import PhotoPage from "./PhotoPage"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PhotoPage />
    </Suspense>
  )
}
