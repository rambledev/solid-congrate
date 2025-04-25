// theme/ThemeComponent.tsx
'use client'

import { ReactNode, useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { useSettings } from '@/context/settingsContext'

export const ThemeComponent = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings()

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: settings.mode,
          primary: {
            main: '#1976d2'
          },
          background: {
            default: settings.mode === 'light' ? '#f5f5f5' : '#121212'
          }
        }
      }),
    [settings]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
