import { compose, space, layout, flexbox, color, border, position, type styleFn, typography, flexDirection, flexBasis, zIndex, boxShadow } from 'styled-system'
import { gap } from './customSystem/gap'
import { cursor } from './customSystem/cursor'
import { direction } from './customSystem/direction'
import { textDecoration } from './customSystem/textDecoration'

export const commonComposes = (extra?: Array<styleFn>) => {
  return compose(space, layout, flexbox, color, border, position, typography, zIndex, flexBasis, flexDirection, boxShadow, gap, cursor, textDecoration, direction, ...(extra ?? []))
}
