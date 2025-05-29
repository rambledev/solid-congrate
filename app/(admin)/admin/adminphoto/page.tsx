// page.tsx
import { Suspense } from "react"
import AdminPhotoPage from "./AdminPhotoPage"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPhotoPage />
    </Suspense>
  )
}
