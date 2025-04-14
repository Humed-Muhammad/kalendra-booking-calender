import { system } from 'styled-system'

const gapConfig = {
  gap: {
    property: 'gap' as const,
    scale: 'space' as const,
  },
  rowGap: {
    property: 'rowGap' as const,
    scale: 'space' as const,
  },
  columnGap: {
    property: 'columnGap' as const,
    scale: 'space' as const,
  },
}

export const gap = system(gapConfig)
