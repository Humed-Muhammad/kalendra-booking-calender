import { system } from 'styled-system'

const textDecorationConfig = {
  textDecoration: {
    property: 'textDecoration' as const,
  },
}

export const textDecoration = system(textDecorationConfig)
