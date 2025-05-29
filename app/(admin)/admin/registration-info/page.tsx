// app/(admin)/admin/registration-info/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const RegistrationInfoClient = dynamic(() => import('./RegistrationInfoClient'), {
  ssr: false,
})

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RegistrationInfoClient />
    </Suspense>
  )
}
