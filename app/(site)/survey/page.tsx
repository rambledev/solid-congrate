// app/(site)/survey/page.tsx
import { Suspense } from "react"
import SurveyPage from "./SurveyPage"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyPage />
    </Suspense>
  )
}
