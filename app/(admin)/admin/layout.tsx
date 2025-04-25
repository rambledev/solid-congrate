'use client'

import { ReactNode } from 'react'
import { SettingsProvider } from '@/context/settingsContext'
import { ThemeComponent } from '@/theme/ThemeComponent'
import VerticalLayout from '@/@layouts/VerticalLayout'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ThemeComponent>
        <VerticalLayout>{children}</VerticalLayout>
      </ThemeComponent>
    </SettingsProvider>
  )
}
