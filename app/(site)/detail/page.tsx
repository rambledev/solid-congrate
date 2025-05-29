// app/(site)/detail/page.tsx
import { Suspense } from "react"
import DetailPage from "./DetailPage"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailPage />
    </Suspense>
  )
}
