// context/settingsContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Settings = {
  mode: 'light' | 'dark'
}

const defaultSettings: Settings = {
  mode: 'light'
}

type SettingsContextType = {
  settings: Settings
  saveSettings: (updatedSettings: Settings) => void
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  saveSettings: () => null
})

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const saveSettings = (updatedSettings: Settings) => {
    setSettings(updatedSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
