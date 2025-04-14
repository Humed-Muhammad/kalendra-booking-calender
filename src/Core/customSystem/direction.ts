import { system } from 'styled-system'

const directionConfig = {
  direction: {
    property: 'direction' as const,
  },
}

export const direction = system(directionConfig)
