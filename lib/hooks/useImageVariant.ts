import type { Mode } from '../../types/themeTypes'

/**
 * Hook to select image variant based on theme mode
 * @param mode - Current theme mode ('light' or 'dark')
 * @param lightImg - Image path for light mode
 * @param darkImg - Image path for dark mode
 * @returns Selected image path based on current mode
 */
export const useImageVariant = (
  mode: Mode | undefined,
  lightImg: string,
  darkImg: string
): string => {
  return mode === 'dark' ? darkImg : lightImg
}