import styled from 'styled-components'
import { variant } from 'styled-system'
import type { ImageProps } from './types'
import { commonComposes } from '../common'

export const Image = styled('img')<ImageProps>(
  {},
  variant({
    variants: {
      'top-rounded': {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
      },
      rounded: {
        borderRadius: '10px',
      },
    },
  }),
  commonComposes(),
)

Image.defaultProps = {
  variant: 'rounded',
}
