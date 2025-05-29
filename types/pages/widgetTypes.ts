// /types/pages/widgetTypes.ts

export interface CardStatsVerticalProps {
    title: string
    stats: string | number
    icon?: React.ReactNode
    color?: string
    trendNumber?: string
    trendDirection?: 'up' | 'down'
  }
  