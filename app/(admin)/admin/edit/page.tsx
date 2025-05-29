// app/(admin)/admin/edit/page.tsx
import { Suspense } from "react"
import AdminEditPage from "./AdminEditPage"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminEditPage />
    </Suspense>
  )
}
